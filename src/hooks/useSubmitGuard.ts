import { useCallback, useRef, useState } from 'react';

/**
 * Prevents duplicate submissions: while `run` is busy (and for a short cooldown
 * afterwards, to absorb double-clicks on synchronous handlers) further calls are
 * ignored. `isSubmitting` drives disabled buttons / spinners.
 */
export default function useSubmitGuard(cooldownMs = 600) {
  const busyRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const run = useCallback(async (fn: () => void | Promise<void>): Promise<boolean> => {
    if (busyRef.current) return false;
    busyRef.current = true;
    setIsSubmitting(true);
    try {
      await fn();
      return true;
    } finally {
      setTimeout(() => {
        busyRef.current = false;
        setIsSubmitting(false);
      }, cooldownMs);
    }
  }, [cooldownMs]);

  return { isSubmitting, run };
}
