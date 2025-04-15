import React from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";

import { BooksPageFilters } from "../pages/BooksPage/BooksPageFilters.tsx";

import { pages } from "@/pages";
import { useCurrentPage } from "@/hooks/useCurrentPage.ts";
import { AuthorsPageFilters } from "@/pages/AuthorsPage/AuthorsPageFilters.tsx";

const pageFilters = {
  [pages.books]: <BooksPageFilters />,
  [pages.authors]: <AuthorsPageFilters />,
};

export const FiltersPanel: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const currentPage = useCurrentPage();

  if (!currentPage) return null;

  return (
    <>
      <Button color="primary" size={"sm"} variant="flat" onPress={onOpen}>
        Фильтры
      </Button>
      <Drawer
        backdrop={"blur"}
        isOpen={isOpen}
        placement="right"
        size="sm"
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="border-b border-divider">
                <h2 className="text-xl font-semibold">Фильтры</h2>
              </DrawerHeader>
              <DrawerBody>{pageFilters[currentPage]}</DrawerBody>
              <DrawerFooter>
                <div className="flex gap-3 justify-end">
                  <Button color="default" variant="flat" onPress={onClose}>
                    Закрыть
                  </Button>
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
