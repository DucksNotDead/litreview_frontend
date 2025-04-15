import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

import { TFormConfig, useForm } from "@/hooks/useForm.tsx";
import { IUserLoginDto, IUserRegisterDto } from "@/api/accountApi.ts";
import { useAccount } from "@/providers/AccountProvider.tsx";

interface IAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<IAccountModalProps> = ({
  open,
  onClose: handleClose,
}) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { login, register } = useAccount();

  const formConfig = useMemo<TFormConfig<IUserLoginDto | IUserRegisterDto>>(
    () => ({
      email: {
        label: "Почта",
        required: true,
      },
      password: {
        label: "Пароль",
        instance: {
          type: "input",
          isPassword: true,
          validation: { minLength: true },
        },
      },
      fio: {
        label: "ФИО",
        hidden: mode === "login",
        required: true,
      },
      description: {
        label: "О себе",
        hidden: mode === "login",
        required: true,
      },
    }),
    [mode],
  );

  const form = useForm(formConfig);

  const { isOpen, onOpenChange } = useDisclosure({
    isOpen: open,
    onClose: handleClose,
  });

  const handleChangeMode = useCallback(() => {
    setMode((prevState) => (prevState === "login" ? "register" : "login"));
  }, []);

  const handleFormSubmit = useCallback<(onClose: () => void) => void>(
    (onClose) => {
      if (mode === "login") {
        login(form.values as IUserLoginDto);
      } else {
        register(form.values as IUserRegisterDto);
      }

      onClose();
    },
    [mode, login, register, form.values],
  );

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setMode(() => "login");
    }
  }, [isOpen, form.reset]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {mode === "login" ? "Вход" : "Регистрация"}
            </ModalHeader>
            <ModalBody>
              {form.node}
              <div className={"flex justify-center"}>
                <Link
                  className={"cursor-pointer"}
                  size={"sm"}
                  onPress={handleChangeMode}
                >
                  {mode === "login"
                    ? "Добавить аккаунт"
                    : "Уже есть аккаунт? Войти"}
                </Link>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={onClose}>
                Закрыть
              </Button>
              <Button
                color="primary"
                isDisabled={!form.isReady}
                type={"submit"}
                onPress={() => handleFormSubmit(onClose)}
              >
                {mode === "login" ? "Войти" : "Зарегистрироваться"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
