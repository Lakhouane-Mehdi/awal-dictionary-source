import * as Sentry from "@sentry/react";
import { DataService } from "../services/DataService";

let started = false;

/**
 * Starts Sentry only when a DSN is configured *and* the visitor has opted in
 * to analytics in the cookie banner. Session replay and tracing collect
 * usage data, so they must not run before consent. Safe to call repeatedly:
 * main.tsx calls it on load, and CookieBanner calls it again when consent
 * is granted.
 */
export const initMonitoring = async (): Promise<void> => {
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn || started) return;

    const consent = await DataService.getConsent();
    if (!consent?.analytics) return;

    started = true;
    Sentry.init({
        dsn,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration(),
        ],
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    });
};
