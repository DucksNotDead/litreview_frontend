import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { pages } from "@/pages";

export const useCurrentPage = () => {
  const { pathname } = useLocation();

  return useMemo(() => {
    if (pathname.includes(pages.books)) return pages.books;
    if (pathname.includes(pages.authors)) return pages.authors;
  }, [pathname]);
};
