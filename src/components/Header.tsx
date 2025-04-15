import React, { Key, useCallback, useMemo } from "react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { AddCircle } from "@solar-icons/react";

import { routes } from "@/pages";
import { AccountPanel } from "@/components/AccountPanel.tsx";
import { FiltersPanel } from "@/components/FiltersPanel.tsx";
import { useAccess } from "@/hooks/useAccess.ts";
import { CreateUpdateModal } from "@/modals/CreateUpdateModal.tsx";

export const Header: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const canEdit = useAccess();

  const selectedKey = useMemo(() => {
    return `/${pathname.split("/")[1]}`;
  }, [pathname]);

  const handleSelectionChange = useCallback(
    (path: Key) => navigate(path as string),
    [navigate],
  );

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit text-2xl">LitReview</p>
        </NavbarBrand>
        <NavbarContent justify="center">
          {canEdit && (
            <NavbarItem>
              <Button
                isIconOnly
                color={"primary"}
                size={"sm"}
                variant={"light"}
                onPress={onOpen}
              >
                <AddCircle size={24} />
              </Button>
            </NavbarItem>
          )}
          <NavbarItem>
            <Tabs
              selectedKey={selectedKey}
              size={"sm"}
              onSelectionChange={handleSelectionChange}
            >
              {routes.map((route) => (
                <Tab key={route.path} title={route.name} />
              ))}
            </Tabs>
          </NavbarItem>
          <NavbarItem>
            <FiltersPanel />
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <AccountPanel />
        </NavbarContent>
      </Navbar>
      <CreateUpdateModal
        isOpen={isOpen}
        onCancel={onClose}
        onOpenChange={onOpenChange}
      />
    </>
  );
};
