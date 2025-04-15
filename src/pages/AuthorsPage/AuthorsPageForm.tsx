import { addToast, ModalBody } from "@heroui/react";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useForm } from "@/hooks/useForm.tsx";
import { authorsApi, ICreateAuthorDto } from "@/api/authorsApi.ts";
import { FormModalFooter } from "@/components/FormModalFooter.tsx";
import { IPageFormProps } from "@/globals/types.ts";
import { keys } from "@/globals/consts.ts";

export const AuthorsPageForm = ({ onCancel }: IPageFormProps) => {
  const queryClient = useQueryClient();

  const { node, isReady, values, reset } = useForm<ICreateAuthorDto>({
    fio: {
      label: "ФИО",
      required: true,
      instance: {
        type: "input",
        validation: { isPrimaryLength: true },
      },
    },
    birth_date: {
      label: "Дата рождения",
      required: true,
      instance: {
        type: "date",
      },
    },
    death_date: {
      label: "Дата смерти",
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
  });

  const { mutate: createMutation } = useMutation({
    mutationKey: ["createAuthor"],
    mutationFn: authorsApi.createAuthor,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [keys.authors] });
      addToast({ title: "Автор добавлен", color: "success" });
    },
    onError: () => {
      addToast({ title: "ошибка добавления автора", color: "danger" });
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
