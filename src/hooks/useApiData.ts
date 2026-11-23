import { useEffect, useState } from 'react';
import { api, ApiError } from '../services/api';

/**
 * Loads data from the API and reports what is happening:
 * isLoading while waiting, error if it failed, data when it arrived.
 * reload() tries again (for a "Try again" button).
 */
export function useApiData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false; // set on cleanup, so a late answer for an old path is ignored
    setData(null);
    setError(null);
    api
      .get<T>(path)
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof ApiError ? err : new ApiError(0, 'UNKNOWN_ERROR', 'Something went wrong'));
        }
      });
    return () => {
      ignore = true;
    };
  }, [path, attempt]);

  return {
    data,
    error,
    isLoading: data === null && error === null,
    reload: () => setAttempt((count) => count + 1),
  };
}