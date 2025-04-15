import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo } from "react";
import { addToast, ModalBody } from '@heroui/react';

import { booksApi, ICreateBookDto } from "@/api/booksApi.ts";
import { TFormConfig, useForm } from "@/hooks/useForm.tsx";
import { keys } from "@/globals/consts.ts";
import { categoriesApi } from "@/api/categoriesApi.ts";
import { authorsApi } from "@/api/authorsApi.ts";
import { IPageFormProps } from "@/globals/types.ts";
import { FormModalFooter } from "@/components/FormModalFooter.tsx";

export const BooksPageForm: React.FC<IPageFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: [keys.categories],
    queryFn: categoriesApi.getCategories,
  });

  const { data: authorsData, isLoading: authorsLoading } = useQuery({
    queryKey: [keys.authors],
    queryFn: () => authorsApi.getAuthors({ fio: "" }),
  });

  const config = useMemo<TFormConfig<ICreateBookDto>>(
    () => ({
      title: {
        label: "Заголовок",
        required: true,
        instance: {
          type: "input",
        },
      },
      author_ids: {
        label: "Авторы",
        required: true,
        instance: {
          type: "multiSelect",
          options:
            authorsData?.data.map((a) => ({ label: a.fio, value: a.id })) ?? [],
          loading: authorsLoading,
        },
      },
      category_ids: {
        label: "Жанры",
        required: true,
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
      pages_count: {
        label: "Количество странц",
        required: true,
        instance: {
          type: "numberInput",
        },
      },
      published_date: {
        label: "Дата публикации",
        required: true,
        instance: {
          type: "date",
        },
      },
      description: {
        label: "Описание",
        instance: {
          type: "textarea",
        },
      },
    }),
    [categoriesLoading, authorsLoading, authorsData, categoriesData],
  );

  const { node, isReady, values, reset } = useForm(config);

  const { mutate: createMutation } = useMutation({
    mutationKey: ["createBook"],
    mutationFn: booksApi.createBook,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [keys.books] });
      addToast({ title: "Книга добавлена", color: "success" });
    },
    onError: () => {
      addToast({ title: "Ошибка добавления книги", color: "danger" });
    },
  });

  const handleClose = useCallback(() => {
    onCancel();
    reset();
  }, [onCancel]);

  const handleSubmit = useCallback(() => {
    createMutation(values!);
    handleClose();
  }, [values, handleClose]);

  return (
    <>
      <ModalBody>{node}</ModalBody>
      <FormModalFooter
        disabled={!isReady}
        onCancel={handleClose}
        onConfirm={handleSubmit}
      />
    </>
  );
};
