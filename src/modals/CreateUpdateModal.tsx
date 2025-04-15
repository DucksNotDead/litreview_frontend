import React, { useCallback } from "react";
import { Modal, ModalContent, ModalHeader } from "@heroui/react";

import { pages } from "@/pages";
import { BooksPageForm } from "@/pages/BooksPage/BooksPageForm.tsx";
import { useCurrentPage } from "@/hooks/useCurrentPage.ts";
import { AuthorsPageForm } from "@/pages/AuthorsPage/AuthorsPageForm.tsx";
import { IModalProps } from "@/globals/types.ts";

// const pageForms = {
//   [pages.books]: BooksPageForm,
// };

export const CreateUpdateModal: React.FC<IModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const currentPage = useCurrentPage();

  const pageForm = useCallback(
    (onCancel: () => void) => {
      if (currentPage === pages.books) {
        return <BooksPageForm onCancel={onCancel} />;
      }
      if (currentPage === pages.authors) {
        return <AuthorsPageForm onCancel={onCancel} />;
      }
    },
    [currentPage],
  );

  if (!currentPage) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Добавить</ModalHeader>
            {pageForm(onClose)}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
