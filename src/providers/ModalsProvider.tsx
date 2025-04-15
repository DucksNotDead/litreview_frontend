import React, { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { modals } from "@/modals";
import { MODAL_POSTFIX } from "@/globals/consts.ts";

type TModalName = keyof typeof modals;

interface IModalsProviderProps {
  children: React.ReactNode;
}

export const ModalsProvider: React.FC<IModalsProviderProps> = ({
  children,
}) => (
  <>
    {Object.keys(modals).map((key) => (
      <div key={key}>{modals[key as TModalName]}</div>
    ))}
    {children}
  </>
);

export const useOpenModal = (): ((name: TModalName, key?: string) => void) => {
  const [, setSearchParams] = useSearchParams();

  return useCallback((name, key) => {
    setSearchParams((prev) => {
      prev.append(`${name}${MODAL_POSTFIX}`, key ?? "true");

      return prev;
    });
  }, []);
};

export const useAppModal = (name: TModalName) => {
  const open = useOpenModal();
  const [searchParams, setSearchParams] = useSearchParams();

  const value = useMemo(() => {
    const item = searchParams.get(`${name}${MODAL_POSTFIX}`);

    return item ? String(item) : undefined;
  }, [searchParams]);

  const isOpen = useMemo(() => {
    return !!value;
  }, [value]);

  const onOpenChange = useCallback<(isOpen: boolean) => void>(
    (isOpen) => {
      if (isOpen) open(name);
      else
        setSearchParams((prev) => {
          prev.delete(`${name}${MODAL_POSTFIX}`);

          return prev;
        });
    },
    [setSearchParams],
  );

  return { value, isOpen, onOpenChange };
};
