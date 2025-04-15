import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/react";

import { IUser } from "@/globals/types.ts";
import { ADMIN_ROUTES } from "@/globals/consts.ts";
import {
  accountApi,
  IUserLoginDto,
  IUserRegisterDto,
} from "@/api/accountApi.ts";
import { useDebounceLoading } from "@/hooks/useDebounceLoading.ts";

interface IAccountContextValue {
  account: IUser | null;
  login: (dto: IUserLoginDto) => void;
  register: (dto: IUserRegisterDto) => void;
  logout?: () => void;
  isLoading: boolean;
}

interface IAccountProviderProps {
  children: React.ReactNode;
}

const AccountContext = createContext<IAccountContextValue>({
  account: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  isLoading: false,
});

export const AccountProvider: React.FC<IAccountProviderProps> = ({
  children,
}) => {
  const [account, setAccount] = useState<IAccountContextValue["account"]>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { mutate: auth, isPending: authPending } = useMutation({
    mutationKey: ["auth"],
    mutationFn: accountApi.auth,
    onSuccess: ({ data }) => {
      setAccount(() => data);
    },
    onError: () => {
      setAccount(() => null);
    },
  });

  const { mutate: login, isPending: loginPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: accountApi.login,
    onSuccess: ({ data }) => {
      setAccount(() => data);
      addToast({ title: "Вход выполнен", color: "success" });
    },
    onError: () => {
      setAccount(() => null);
      addToast({ title: "Ошибка входа", color: "danger" });
    },
  });

  const { mutate: register, isPending: registerPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: accountApi.register,
    onSuccess: ({ data }) => {
      setAccount(() => data);
      addToast({ title: "Регистрация выполнена", color: "success" });
    },
    onError: () => {
      setAccount(() => null);
      addToast({ title: "Ошибка регистрации", color: "danger" });
    },
  });

  const { mutate: logout, isPending: logoutPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: accountApi.logout,
    onSuccess: () => {
      setAccount(() => null);
    },
    onError: () => {},
  });

  const isLoading = useDebounceLoading(
    authPending,
    loginPending,
    registerPending,
    logoutPending,
  );

  useEffect(() => {
    if (
      !account?.is_admin &&
      ADMIN_ROUTES.find((route) => pathname.includes(route))
    ) {
      navigate("/");
    }
  }, [pathname, account, navigate]);

  useEffect(() => {
    if (!account) auth();
  }, [account, auth]);

  return (
    <AccountContext.Provider
      value={{ account, isLoading, login, register, logout }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
