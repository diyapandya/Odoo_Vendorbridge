"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export function AutoSignout() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        await signOut({ callbackUrl: "/login" });
      }, TIMEOUT_MS);
    };

    // Listen for user activity
    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Start timer initially
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [session]);

  return null;
}
