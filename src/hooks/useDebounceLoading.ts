import { useEffect, useMemo, useRef, useState } from "react";

export const useDebounceLoading = (...states: boolean[]) => {
  const [isResultLoading, setIsResultLoading] = useState(true);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isComplexLoading = useMemo(() => {
    return states.some((state) => state);
  }, [...states]);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    if (isComplexLoading) {
      setIsResultLoading(() => true);
    } else {
      timeout.current = setTimeout(() => {
        setIsResultLoading(() => false);
      }, 1500);
    }
  }, [isComplexLoading]);

  return isResultLoading;
};
