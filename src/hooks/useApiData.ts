import { useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Loads data from the API and reports what is happening:
 * isLoading while waiting, error if it failed, data when it arrived.
 * reload() fetches again and keeps showing the old data until the new answer arrives.
 * Pass null to load nothing (for example when creating a new item).
 */
export function useApiData<T>(path: string | null) {
  const { logout } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [attempt, setAttempt] = useState(0);
  const loadedPath = useRef<string | null>(null);

  useEffect(() => {
    if (path === null) return;
    let ignore = false; // set on cleanup, so a late answer for an old path is ignored

    // A different address means different data, so forget the old data.
    // A plain reload keeps the old data on screen until the new answer arrives.
    if (loadedPath.current !== path) {
      setData(null);
      loadedPath.current = path;
    }
    setError(null);

    api
      .get<T>(path)
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err) => {
        if (ignore) return;
        const apiError =
          err instanceof ApiError ? err : new ApiError(0, 'UNKNOWN_ERROR', 'Something went wrong');
        // An ended login session on an admin screen sends the owner back to the login page.
        if (apiError.status === 401 && path.startsWith('/admin')) void logout();
        setError(apiError);
      });

    return () => {
      ignore = true;
    };
  }, [path, attempt]);

  return {
    data,
    error,
    isLoading: path !== null && data === null && error === null,
    reload: () => setAttempt((count) => count + 1),
  };
}