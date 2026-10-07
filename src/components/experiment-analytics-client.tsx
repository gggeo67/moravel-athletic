"use client";

import { RequestSourceProvider } from "./request-source-provider";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { Analytics } from "@vercel/analytics/next";
import { track as vercelTrack } from "@vercel/analytics";
import {
  updateAttribution,
  clearAttribution,
  rememberArrival,
} from "@/lib/visit-attribution-browser";
import {
  attributionProperties,
  privatePath,
  webAnalyticsEvent,
} from "@/lib/visit-attribution";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { analyticsSite } from "@/config/analytics";
import {
  analyticsConsentKey,
  analyticsCookie,
  analyticsEvents,
  allowedProperties,
  safeCampaign,
  safePath,
  safeReferrer,
  performanceEvent,
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
  clearAttribution();
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
  const attribution = attributionProperties(updateAttribution());
  if (privatePath(location.pathname)) return;
  if (environment === "production" && event !== "$pageview") {
    vercelTrack(event, {
      site_id: analyticsSite.id,
      source: attribution.latest_source ?? "unknown",
      path: safePath(location.pathname),
      ...properties,
    });
  }
  posthog.capture(event, {
    ...attribution,
    ...properties,
    site_id: analyticsSite.id,
    site_type: analyticsSite.kind,
    experiment_id: "GEO-2407",
    experiment_arm: analyticsSite.experimentArm,
    pair_id: analyticsSite.pairId,
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

function ExistingExperimentAnalytics() {
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
    rememberArrival();
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
      if (String(analyticsSite.kind) === "publisher") {
        const section = pathname.split("/").filter(Boolean)[0] ?? "home";
        if (
          /^(reviews|guides|compare|comparisons|changes|plans|tools|destinations|planning|articles|resources)$/.test(
            section,
          ) &&
          pathname.split("/").filter(Boolean).length > 1
        )
          capture("article_viewed", { content_section: section });
      }
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
          link_position: link.closest("header")
            ? "header"
            : link.closest("footer")
              ? "footer"
              : "content",
          destination_host: url.hostname,
          destination_path: safePath(url.pathname),
        });
      else if (
        /^\/(?:pages\/)?(pricing|start|contact|checkout|sign-up|preorder)(\/|$)/.test(
          url.pathname,
        )
      )
        capture("cta_clicked", { destination_path: safePath(url.pathname) });
    };
    const focus = (event: FocusEvent) => {
      const form =
        event.target instanceof Element ? event.target.closest("form") : null;
      if (!form || started.current.has(form) || !permitted()) return;
      started.current.add(form);
      capture("form_started", { form_type: safePath(location.pathname) });
    };
    const submit = (event: SubmitEvent) => {
      if (event.target instanceof HTMLFormElement)
        capture("form_submitted", { form_type: safePath(location.pathname) });
    };
    document.addEventListener("submit", submit);
    document.addEventListener("click", click);
    document.addEventListener("focusin", focus);
    return () => {
      document.removeEventListener("submit", submit);
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
      {choice === "allowed" && environment === "production" && (
        <>
          <Analytics
            beforeSend={(event) =>
              permitted() ? webAnalyticsEvent(event) : null
            }
          />
          <SpeedInsights
            sampleRate={1}
            debug={false}
            beforeSend={(event) =>
              permitted() ? performanceEvent(event) : null
            }
          />
        </>
      )}
      {open ? (
        <section className={styles.panel} aria-label="Analytics preferences">
          <strong>
            Optional analytics{analyticsSite.adultOnly ? " for grown-ups" : ""}
          </strong>
          <p>
            Allow PostHog and Vercel to measure visits, referral sources,
            requests and page performance? We remember visit sources for up to
            90 days and attach them to requests you submit. No form contents are
            sent to analytics, and no session recordings.{" "}
            <a href={analyticsSite.privacy}>Privacy details</a>.
          </p>
          <p>
            For eligible US visits, a request may also include the source of
            this visit. You can opt out on the form or choose Decline here.{" "}
            <a href={analyticsSite.privacy}>Details</a>.
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

export function ExperimentAnalytics() {
  return (
    <>
      <RequestSourceProvider />
      <ExistingExperimentAnalytics />
    </>
  );
}
