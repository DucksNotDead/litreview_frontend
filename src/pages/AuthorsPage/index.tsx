import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { authorsApi } from "@/api/authorsApi.ts";
import { keys } from "@/globals/consts.ts";
import { AuthorsPageCard } from "@/pages/AuthorsPage/AuthorsPageCard.tsx";
import { useFilters } from "@/providers/FiltersProvider.tsx";

export const AuthorsPage: React.FC = () => {
  const filters = useFilters();

  const authorsFilters = useMemo(() => {
    return filters.getValues("authors") as unknown as { fio: string };
  }, [filters]);

  const { data } = useQuery({
    queryKey: [keys.authors, authorsFilters],
    queryFn: () => authorsApi.getAuthors(authorsFilters),
  });

  const authors = useMemo(() => data?.data ?? [], [data]);

  return (
    <div className="grid grid-cols-2 gap-4 pt-4 pb-12">
      {authors.map((author) => (
        <AuthorsPageCard key={author.id} author={author} />
      ))}
    </div>
  );
};
