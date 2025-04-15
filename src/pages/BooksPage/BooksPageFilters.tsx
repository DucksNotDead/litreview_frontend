import React, { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { TFormConfig, useForm } from "../../hooks/useForm.tsx";
import { IFindBooksDto } from "../../api/booksApi.ts";

import { categoriesApi } from "@/api/categoriesApi.ts";
import { authorsApi } from "@/api/authorsApi.ts";
import { TFiltersValues, useFilters } from "@/providers/FiltersProvider.tsx";
import { keys } from "@/globals/consts.ts";

export const BooksPageFilters: React.FC = () => {
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: [keys.categories],
    queryFn: categoriesApi.getCategories,
  });

  const { data: authorsData, isLoading: authorsLoading } = useQuery({
    queryKey: [keys.authors],
    queryFn: () => authorsApi.getAuthors({ fio: "" }),
  });

  const config = useMemo<TFormConfig<IFindBooksDto>>(
    () => ({
      title: {
        label: "Поиск",
        instance: {
          type: "input",
        },
      },
      categoryIds: {
        label: "Жанры",
        instance: {
          type: "multiSelect",
          options:
            categoriesData?.data.map((c) => ({
              label: c.name,
              value: c.id,
            })) ?? [],
          loading: categoriesLoading,
        },
      },
      authorIds: {
        label: "Авторы",
        instance: {
          type: "multiSelect",
          options:
            authorsData?.data.map((a) => ({ label: a.fio, value: a.id })) ?? [],
          loading: authorsLoading,
        },
      },
    }),
    [categoriesLoading, authorsLoading, authorsData, categoriesData],
  );

  const { setValues, getValues } = useFilters();

  const prevValues = useMemo(() => {
    return getValues("books") as unknown as IFindBooksDto;
  }, [getValues]);

  const { node, values } = useForm(config, { values: prevValues });

  useEffect(() => {
    values && setValues("books", values as unknown as TFiltersValues);
  }, [values]);

  return node;
};
