import * as Sentry from "@sentry/react";

export const initMonitoring = () => {
    // Check for Sentry DSN in environment variables
    // In Vite, env vars are exposed via import.meta.env
    const dsn = import.meta.env.VITE_SENTRY_DSN;

    if (dsn) {
        Sentry.init({
            dsn: dsn,
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration(),
            ],
            // Performance Monitoring
            tracesSampleRate: 1.0, // Capture 100% of the transactions
            // Session Replay
            replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
            replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
        });
        console.log("Monitoring initialized.");
    } else {
        console.log("Monitoring skipped: No DSN found.");
    }
};
