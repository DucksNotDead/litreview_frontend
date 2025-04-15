import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const useIsMainRoutes = (route?: "/books" | "/authors") => {
  const { pathname } = useLocation();

  const isMain = useMemo(() => {
    return ["/books", "/authors"].some((path) => pathname.includes(path));
  }, [pathname]);

  return route ? pathname.includes(route) : isMain;
};
