import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@heroui/react";
import React, { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IBook } from "@/globals/types.ts";
import { Mark } from "@/components/Mark.tsx";
import { EditPanel } from "@/components/EditPanel.tsx";
import { useAccess } from "@/hooks/useAccess.ts";
import { booksApi } from "@/api/booksApi.ts";
import { keys } from "@/globals/consts.ts";

interface IBookCardProps {
  book: IBook;
  onOpenReviews: (id: number) => void;
}

export function BooksPageCard({
  book,
  onOpenReviews,
}: IBookCardProps): React.ReactNode {
  const queryClient = useQueryClient();
  const hasAccess = useAccess();

  const { mutate: deleteMutation } = useMutation({
    mutationKey: ["deleteBook"],
    mutationFn: booksApi.deleteBook,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [keys.book] });
      addToast({ title: "Книга удалена", color: "success" });
    },
    onError: () => {
      addToast({ title: "Ошибка удаления книги", color: "danger" });
    },
  });

  const handlePress = useCallback(() => {
    onOpenReviews(book.id);
  }, [book.id]);

  const handleEdit = useCallback(() => {
    /*openModal("set", book.id + "");*/
  }, [book.id]);

  const handleDelete = useCallback(() => {
    deleteMutation(book.id);
  }, [deleteMutation, book.id]);

  return (
    <Card className="w-full max-w-lg" onPress={handlePress}>
      <CardHeader className={"flex justify-between items-center"}>
        <h2 className="text-md font-bold text-gray-900">{book.title}</h2>
        <div className={"flex gap-4"}>
          <EditPanel
            canDelete={hasAccess}
            canEdit={hasAccess}
            hasAccess={hasAccess}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
          <Button color={"primary"} size={"sm"} onPress={handlePress}>
            Перейти к оценкам
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex items-center space-x-2 mb-4">
          {book.authors.map((author) => (
            <span key={author.id} className="text-sm font-medium text-gray-800">
              {author.fio}
            </span>
          ))}
        </div>
        <p className="text-gray-700 text-sm mb-4 flex-1">{book.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {book.categories.map((category) => (
            <span
              key={category.id}
              className="text-xs font-semibold px-2 py-1 rounded-full text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          ))}
        </div>
      </CardBody>
      <CardFooter className="flex items-center">
        <div className={"flex-1"}>
          <Mark value={book.rating} />
        </div>
        <p className="text-sm text-gray-600">
          {book.published_date && new Date(book.published_date).getFullYear()}г.
        </p>
        <p className="flex-1 text-sm text-gray-600 text-end">
          ~{book.pages_count} страниц
        </p>
      </CardFooter>
    </Card>
  );
}
