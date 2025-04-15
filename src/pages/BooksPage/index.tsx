import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { booksApi, IFindBooksDto } from "@/api/booksApi.ts";
import { useFilters } from "@/providers/FiltersProvider.tsx";
import { BooksPageCard } from "@/pages/BooksPage/BookPageCard.tsx";
import { keys } from "@/globals/consts.ts";
import { ReviewsModal } from "@/modals/ReviewsModal.tsx";

export const BooksPage: React.FC = () => {
  const [openedBook, setOpenedBook] = useState<number | null>(null);
  const filters = useFilters();

  const booksFilters = useMemo(() => {
    return filters.getValues("books") as unknown as IFindBooksDto;
  }, [filters]);

  const { data } = useQuery({
    queryKey: [keys.books, booksFilters],
    queryFn: () => booksApi.getBooks(booksFilters),
  });

  const books = useMemo(() => data?.data ?? [], [data]);

  const handleOpenBookReviews = useCallback((id: number) => {
    setOpenedBook(() => id);
  }, []);

  const handleCloseBookReviews = useCallback(() => {
    setOpenedBook(() => null);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 pt-4 pb-12">
      {books.map((book) => (
        <BooksPageCard
          key={book.id}
          book={book}
          onOpenReviews={handleOpenBookReviews}
        />
      ))}
      <ReviewsModal value={openedBook} onClose={handleCloseBookReviews} />
    </div>
  );
};
