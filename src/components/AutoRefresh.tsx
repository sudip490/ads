"use client";

import { useEffect } from "react";

export function AutoRefresh() {
    useEffect(() => {
        const timer = setTimeout(async () => {
            // Clear all caches
            if ("caches" in window) {
                try {
                    const names = await caches.keys();
                    await Promise.all(names.map((name) => caches.delete(name)));
                    console.log("Caches cleared.");
                } catch (e) {
                    console.error("Error clearing caches:", e);
                }
            }

            // Clear Service Workers
            if ("serviceWorker" in navigator) {
                try {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (const registration of registrations) {
                        await registration.unregister();
                    }
                    console.log("Service Workers unregistered.");
                } catch (e) {
                    console.error("Error unregistering SW:", e);
                }
            }

            // Force reload from server
            window.location.reload();
        }, 20000); // 20 seconds

        return () => clearTimeout(timer);
    }, []);

    return null;
}
