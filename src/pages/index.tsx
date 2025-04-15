import { BooksPage } from "@/pages/BooksPage";
import { IRoute } from "@/globals/types.ts";
import { AuthorsPage } from "@/pages/AuthorsPage";

export const pages = {
  books: "/books",
  authors: "/authors",
};

export const routes: IRoute[] = [
  { path: "/books", component: <BooksPage />, name: "Книги" },
  { path: "/authors", component: <AuthorsPage />, name: "Авторы" },
];
