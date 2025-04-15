import React from "react";
import { Button, ModalFooter } from "@heroui/react";

interface IModalFooterProps {
  disabled?: boolean;
  label?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const FormModalFooter: React.FC<IModalFooterProps> = ({
  disabled = false,
  label = "Добавить",
  onCancel,
  onConfirm,
}) => {
  return (
    <ModalFooter>
      <Button color="default" variant="flat" onPress={onCancel}>
        Закрыть
      </Button>
      <Button
        color="primary"
        isDisabled={disabled}
        type={"submit"}
        onPress={onConfirm}
      >
        {label}
      </Button>
    </ModalFooter>
  );
};
