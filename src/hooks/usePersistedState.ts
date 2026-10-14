import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { readJSON, writeJSON } from '../utils/storage';

/**
 * useState that hydrates from localStorage and writes back on every change.
 * `hydrate` can normalise the stored value once on load.
 */
export default function usePersistedState<T>(
  key: string,
  fallback: T,
  hydrate?: (stored: T) => T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stored = readJSON(key, fallback);
    return hydrate ? hydrate(stored) : stored;
  });

  useEffect(() => {
    writeJSON(key, value);
  }, [key, value]);

  return [value, setValue];
}
