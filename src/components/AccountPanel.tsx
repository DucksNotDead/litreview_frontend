import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  User,
} from "@heroui/react";
import React, { useCallback, useState } from "react";

import { useAccount } from "@/providers/AccountProvider.tsx";
import { AccountModal } from "@/modals/AccountModal.tsx";

export const AccountPanel: React.FC = () => {
  const { account, isLoading, logout } = useAccount();
  const [open, setOpen] = useState(false);

  const handleEmptyAccountClick = useCallback(() => {
    setOpen(() => true);
  }, []);

  if (isLoading) {
    return (
      <div className="w-[220px] flex items-center gap-3">
        <div>
          <Skeleton className="flex rounded-full w-12 h-12" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <>
      {account ? (
        <Dropdown isDisabled={isLoading} placement={"bottom-end"}>
          <DropdownTrigger>
            <User
              className={"transition user-without-avatar cursor-pointer"}
              description={account.is_admin ? "Администратор" : "Пользователь"}
              name={account.fio}
            />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="logout" onPress={logout}>
              Выйти
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <Button
          isIconOnly
          isDisabled={isLoading}
          radius={"full"}
          size={"sm"}
          onPress={handleEmptyAccountClick}
        >
          <Avatar size={"sm"} />
        </Button>
      )}
      <AccountModal open={open} onClose={() => setOpen(() => false)} />
    </>
  );
};
