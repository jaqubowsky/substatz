"use client";

import { useEffect, useRef } from "react";

/**
 * A hook that handles cleanup when a form component unmounts
 * @param cleanup Function to call on component unmount
 */
export function useFormCleanup(cleanup: () => void) {
  const cleanupRef = useRef(cleanup);

  useEffect(() => {
    cleanupRef.current = cleanup;
  }, [cleanup]);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);
}
