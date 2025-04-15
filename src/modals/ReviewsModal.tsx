import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { keys } from "@/globals/consts";
import { ICreateReviewDto, reviewsApi } from "@/api/reviewsApi.ts";
import { ReviewCard } from "@/pages/BooksPage/BookPageReviewCard.tsx";
import { useForm } from "@/hooks/useForm.tsx";
import { useAccount } from "@/providers/AccountProvider.tsx";

interface IReviewModalProps {
  value: number | null;
  onClose: () => void;
}

export const ReviewsModal: FC<IReviewModalProps> = ({
  value,
  onClose: handleClose,
}) => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure({
    onClose: handleClose,
  });
  const [isCreate, setIsCreate] = useState(false);
  const { account } = useAccount();

  const { data } = useQuery({
    queryKey: [keys.reviews, value],
    queryFn: () => reviewsApi.getReviews(Number(value)),
  });

  const { mutate: createMutation } = useMutation({
    mutationKey: ["createReview"],
    mutationFn: reviewsApi.createReview,
    onSuccess: () => {
      addToast({ title: "Рецензия добавлена", color: "success" });
    },
    onError: () => {
      addToast({ title: "Ошибка добавления рецензии", color: "danger" });
    },
  });

  const { mutate: deleteMutation } = useMutation({
    mutationKey: ["deleteReview"],
    mutationFn: reviewsApi.deleteReview,
    onSuccess: () => {
      addToast({ title: "Рецензия удалена", color: "success" });
    },
    onError: () => {
      addToast({ title: "Ошибка удаления рецензии", color: "danger" });
    },
  });

  const reviews = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  const canEdit = useMemo(() => {
    return account && !reviews.some((r) => r.creator.id === account?.id);
  }, [account, reviews]);

  const { node, values, isReady, reset } = useForm<
    Omit<ICreateReviewDto, "book_id">
  >({
    title: {
      label: "Заголовок",
      required: true,
      instance: {
        type: "input",
        validation: { isPrimaryLength: true },
      },
    },
    body: {
      label: "Текст",
      required: true,
      instance: {
        type: "textarea",
      },
    },
    mark: {
      label: "Оценка",
      instance: {
        type: "numberInput",
        validation: { isMark: true },
      },
    },
  });

  const handleChange = useCallback(() => {
    setTimeout(() => {
      void queryClient.invalidateQueries({ queryKey: [keys.reviews] });
    }, 150);
  }, [queryClient]);

  const handleCreate = useCallback(() => {
    createMutation({ ...values, book_id: +value! } as ICreateReviewDto);
    setIsCreate(() => false);
    handleChange();
  }, [values, createMutation, handleChange]);

  const handleDelete = useCallback(
    (id: number) => {
      deleteMutation(id);
      handleChange();
    },
    [deleteMutation],
  );

  useEffect(() => {
    if (!value) {
      onClose();
      setIsCreate(() => false);
    } else {
      onOpen();
    }
  }, [value]);

  useEffect(() => {
    reset();
  }, [isCreate]);

  return (
    <Modal isOpen={isOpen} size={"5xl"} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Рецензии</ModalHeader>
            <ModalBody>
              {isCreate ? (
                node
              ) : (
                <div className={"grid grid-cols-2 gap-4 pt-4 pb-12"}>
                  {reviews.length ? (
                    reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onDelete={() => handleDelete(review.id)}
                      />
                    ))
                  ) : (
                    <div className={"text-default-500"}>
                      Рецензии на данную книгу отсутствуют
                    </div>
                  )}
                </div>
              )}
            </ModalBody>
            <Footer
              isCreateDisabled={!canEdit}
              isCreateMode={isCreate}
              isCreateReady={isReady}
              onCancel={onClose}
              onCreate={handleCreate}
              onModeChange={setIsCreate}
            />
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

interface IReviewModalFooterProps {
  isCreateDisabled: boolean;
  isCreateMode: boolean;
  isCreateReady: boolean;
  onModeChange: (isCreate: boolean) => void;
  onCancel: () => void;
  onCreate: () => void;
}

const Footer = ({
  isCreateDisabled,
  isCreateMode,
  isCreateReady,
  onModeChange,
  onCreate,
  onCancel,
}: IReviewModalFooterProps) => {
  return (
    <ModalFooter>
      {isCreateMode ? (
        <>
          <Button onPress={() => onModeChange(false)}>Отмена</Button>
          <Button
            color={"primary"}
            isDisabled={!isCreateReady}
            onPress={onCreate}
          >
            Отправить
          </Button>
        </>
      ) : (
        <>
          <Button onPress={onCancel}>Закрыть</Button>
          {!isCreateDisabled && (
            <Button color={"primary"} onPress={() => onModeChange(true)}>
              Добавить рецензию
            </Button>
          )}
        </>
      )}
    </ModalFooter>
  );
};
