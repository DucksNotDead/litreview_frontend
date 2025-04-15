import { Card, CardHeader, CardBody, addToast } from "@heroui/react";
import React, { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IAuthor } from "@/globals/types.ts";
import { Mark } from "@/components/Mark.tsx";
import { useAccess } from "@/hooks/useAccess.ts";
import { EditPanel } from "@/components/EditPanel.tsx";
import { keys } from "@/globals/consts.ts";
import { authorsApi } from "@/api/authorsApi.ts";

interface IAuthorsPageCardProps {
  author: IAuthor;
}

export function AuthorsPageCard({
  author,
}: IAuthorsPageCardProps): React.ReactNode {
  const hasAccess = useAccess();

  const queryClient = useQueryClient();

  const { mutate: deleteMutation } = useMutation({
    mutationKey: ["deleteAuthor"],
    mutationFn: authorsApi.removeAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.authors] });
      addToast({ title: "Автор добавлен", color: "success" });
    },
    onError: () => {
      addToast({ title: "Ошибка добавления автора", color: "danger" });
    },
  });

  const handleDelete = useCallback(() => {
    deleteMutation(author.id);
  }, [deleteMutation, author.id]);

  return (
    <Card className="w-full">
      <CardHeader className={"flex justify-between items-center"}>
        <h2 className="text-lg font-bold text-gray-900">{author.fio}</h2>

        <div className={"flex items-center gap-2"}>
          <Mark value={author.rating} />
          <EditPanel
            canDelete={hasAccess}
            canEdit={hasAccess}
            hasAccess={hasAccess}
            onDelete={handleDelete}
            onEdit={() => {}}
          />
        </div>
      </CardHeader>
      <CardBody>
        {author.description && (
          <p className="text-gray-700 text-sm mb-2">{author.description}</p>
        )}
        <p className="text-sm text-gray-600">
          {author.birth_date
            ? `Родился: ${author.birth_date.split("T")[0].replaceAll("-", ".")}`
            : "Дата рождения неизвестна"}
        </p>
        {author.death_date && (
          <p className="text-sm text-gray-600">
            Умер: {author.death_date.split("T")[0].replaceAll("-", ".")}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
