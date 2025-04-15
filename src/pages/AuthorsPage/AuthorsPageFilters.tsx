import React, { useEffect, useMemo } from "react";

import { useForm } from "@/hooks/useForm.tsx";
import { TFiltersValues, useFilters } from "@/providers/FiltersProvider.tsx";

export const AuthorsPageFilters: React.FC = () => {
  const { setValues, getValues } = useFilters();

  const prevValues = useMemo(() => {
    return getValues("authors") as unknown as { fio: string };
  }, [getValues]);

  const { node, values } = useForm<{ fio: string }>(
    {
      fio: {
        label: "Поиск",
        instance: {
          type: "input",
        },
      },
    },
    { values: prevValues },
  );

  useEffect(() => {
    values && setValues("authors", values as unknown as TFiltersValues);
  }, [values]);

  return node;
};
