"use client";
import { useEffect } from "react";
import { arrivalSource, type RequestSource } from "@/lib/request-source";
import { analyticsConsentKey } from "@/lib/experiment-analytics";
let arrival: RequestSource | null | undefined;
let optedOut = false;
export function RequestSourceProvider() {
  useEffect(() => {
    if (arrival === undefined)
      arrival = arrivalSource(location.href, document.referrer);
    let active = true;
    let eligible = false;
    fetch("/api/request-source-policy", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((v) => {
        if (active) eligible = v?.enabled === true;
      })
      .catch(() => {});
    function blocked() {
      try {
        return (
          optedOut ||
          navigator.doNotTrack === "1" ||
          (navigator as Navigator & { globalPrivacyControl?: boolean })
            .globalPrivacyControl === true ||
          localStorage.getItem(analyticsConsentKey) === "declined"
        );
      } catch {
        return true;
      }
    }
    function attach(event: Event) {
      const e = event as FormDataEvent;
      if (
        !eligible ||
        blocked() ||
        !arrival ||
        e.formData.get("request_source_opt_out") === "on"
      ) {
        e.formData.delete("request_source");
        return;
      }
      e.formData.set("request_source", JSON.stringify(arrival));
    }
    function optOut() {
      optedOut = true;
      arrival = null;
    }
    document.addEventListener("formdata", attach, true);
    window.addEventListener("request-source-opt-out", optOut);
    return () => {
      active = false;
      document.removeEventListener("formdata", attach, true);
      window.removeEventListener("request-source-opt-out", optOut);
    };
  }, []);
  return null;
}
export function RequestSourceNotice() {
  return (
    <p>
      For eligible US visits, we save the source of this visit with your request
      for up to 90 days to understand how people find us. Detailed analytics
      remain optional.{" "}
      <label>
        <input
          type="checkbox"
          name="request_source_opt_out"
          onChange={(e) => {
            if (e.target.checked)
              window.dispatchEvent(new Event("request-source-opt-out"));
          }}
        />{" "}
        Don’t save the source of my request
      </label>
    </p>
  );
}
