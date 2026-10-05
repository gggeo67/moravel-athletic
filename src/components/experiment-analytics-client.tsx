"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { analyticsSite } from "@/config/analytics";
import {
  analyticsConsentKey,
  analyticsCookie,
  analyticsEvents,
  allowedProperties,
  safeCampaign,
  safePath,
  safeReferrer,
} from "@/lib/experiment-analytics";
import styles from "./experiment-analytics.module.css";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const enabled =
  process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true" &&
  !!token &&
  (host === "https://us.i.posthog.com" || host === "https://eu.i.posthog.com");
const environment = process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development";
let initialized = false;
function blocked() {
  return (
    navigator.doNotTrack === "1" ||
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true
  );
}
function consent() {
  try {
    return localStorage.getItem(analyticsConsentKey);
  } catch {
    return null;
  }
}
function permitted() {
  return enabled && !blocked() && consent() === "allowed";
}
function eraseCookie() {
  document.cookie = `${analyticsCookie}=; Path=/; Max-Age=0; SameSite=Lax`;
}
function syncCookie() {
  if (!permitted()) {
    eraseCookie();
    return;
  }
  document.cookie = `${analyticsCookie}=${posthog.get_distinct_id()}.${posthog.get_session_id()}; Path=/; Max-Age=1800; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}
function capture(
  event: (typeof analyticsEvents)[number],
  properties: Record<string, unknown> = {},
) {
  if (!initialized || !permitted()) return;
  syncCookie();
  posthog.capture(event, {
    ...properties,
    site_id: analyticsSite.id,
    site_type: analyticsSite.kind,
    experiment_id: "GEO-2078",
    environment,
    is_test: environment !== "production",
    $current_url: location.origin + safePath(location.pathname),
    $pathname: safePath(location.pathname),
    $host: location.host,
    $process_person_profile: false,
    $geoip_disable: true,
    $ip: null,
  });
}
function initialize() {
  if (!permitted()) return;
  if (!initialized) {
    posthog.init(token!, {
      api_host: host,
      persistence: "sessionStorage",
      person_profiles: "never",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      capture_exceptions: false,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_flags: true,
      disable_external_dependency_loading: true,
      before_send: (event) => {
        if (
          !event ||
          !permitted() ||
          !analyticsEvents.includes(
            event.event as (typeof analyticsEvents)[number],
          )
        )
          return null;
        event.properties = allowedProperties(event.properties);
        return event;
      },
    });
    initialized = true;
  }
  posthog.opt_in_capturing({ captureEventName: false });
  syncCookie();
}

export function ExperimentAnalytics() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<string | null>("loading");
  const [open, setOpen] = useState(false);
  const lastPage = useRef("");
  const started = useRef(new WeakSet<HTMLFormElement>());
  const arrival = useRef<Record<string, unknown> | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const update = () => {
      const value = blocked() ? "declined" : consent();
      setChoice(value);
      setOpen(value === null);
      if (value === "allowed") initialize();
      else eraseCookie();
    };
    // Read initial attribution in memory only; nothing is sent before consent.
    const referrer = safeReferrer(document.referrer);
    const query = new URLSearchParams(location.search);
    arrival.current = {
      $referrer: referrer || "$direct",
      $referring_domain: referrer ? new URL(referrer).hostname : "$direct",
      ...Object.fromEntries(
        ["utm_source", "utm_medium", "utm_campaign"].flatMap((key) => {
          const value = safeCampaign(query.get(key));
          return value ? [[key, value]] : [];
        }),
      ),
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);
  useEffect(() => {
    if (choice !== "allowed" || !pathname || !permitted()) return;
    initialize();
    if (lastPage.current !== pathname) {
      capture("$pageview", lastPage.current ? {} : (arrival.current ?? {}));
      lastPage.current = pathname;
    }
  }, [pathname, choice]);
  useEffect(() => {
    if (!enabled) return;
    const click = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? (event.target.closest("a[href]") as HTMLAnchorElement | null)
          : null;
      if (!link) return;
      const url = new URL(link.href, location.href);
      if (!/^https?:$/.test(url.protocol)) return;
      if (url.origin !== location.origin)
        capture("outbound_clicked", {
          destination_host: url.hostname,
          destination_path: safePath(url.pathname),
        });
      else if (/^\/(start|contact|checkout|sign-up)(\/|$)/.test(url.pathname))
        capture("cta_clicked", { destination_path: safePath(url.pathname) });
    };
    const focus = (event: FocusEvent) => {
      const form =
        event.target instanceof Element ? event.target.closest("form") : null;
      if (!form || started.current.has(form) || !permitted()) return;
      started.current.add(form);
      capture("form_started", { form_type: safePath(location.pathname) });
    };
    document.addEventListener("click", click);
    document.addEventListener("focusin", focus);
    return () => {
      document.removeEventListener("click", click);
      document.removeEventListener("focusin", focus);
    };
  }, []);
  function choose(value: "allowed" | "declined") {
    try {
      localStorage.setItem(analyticsConsentKey, value);
    } catch {
      setChoice("declined");
      setOpen(false);
      return;
    }
    if (value === "declined") {
      eraseCookie();
      if (initialized) {
        posthog.opt_out_capturing();
        posthog.reset();
      }
      lastPage.current = "";
    } else initialize();
    setChoice(value);
    setOpen(false);
  }
  if (!enabled || choice === "loading") return null;
  return (
    <div className={styles.root}>
      {open ? (
        <section className={styles.panel} aria-label="Analytics preferences">
          <strong>
            Optional analytics{analyticsSite.adultOnly ? " for grown-ups" : ""}
          </strong>
          <p>
            Allow PostHog to measure visits, referral sources and completed
            requests? No form contents or session recordings.{" "}
            <a href={analyticsSite.privacy}>Privacy details</a>.
          </p>
          <div className={styles.actions}>
            <button type="button" onClick={() => choose("declined")}>
              Decline
            </button>
            <button
              type="button"
              disabled={blocked()}
              onClick={() => choose("allowed")}
            >
              {analyticsSite.adultOnly
                ? "I’m a grown-up — allow"
                : "Allow analytics"}
            </button>
          </div>
          {blocked() && (
            <p>Your browser privacy preference disables analytics.</p>
          )}
        </section>
      ) : (
        <button
          type="button"
          className={styles.settings}
          onClick={() => setOpen(true)}
        >
          Analytics settings
        </button>
      )}
    </div>
  );
}
