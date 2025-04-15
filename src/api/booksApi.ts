import { api } from "@/api/index.ts";
import { IBook } from "@/globals/types.ts";

export interface IFindBooksDto {
  title?: string;
  categoryIds: string[];
  authorIds: string[];
}

export interface ICreateBookDto {
  title: string;
  author_ids: number[];
  category_ids: number[];
  description: string | null;
  pages_count: number;
  published_date: string | null;
}

export interface IUpdateBookDto extends Partial<ICreateBookDto> {}

const urls = {
  base: "/books",
  get(dto?: IFindBooksDto) {
    const params = new URLSearchParams();

    if (dto?.title) params.set("title", dto?.title);
    if (dto?.categoryIds.length)
      params.set("categoryIds", dto?.categoryIds.join(","));
    if (dto?.authorIds.length)
      params.set("authorIds", dto?.authorIds.join(","));

    return `${this.base}?${params}`;
  },
  item(id: number) {
    return `${this.base}/${id ?? ""}`;
  },
};

function getBooks(dto: IFindBooksDto) {
  return api.get<IBook[]>(urls.get(dto));
}

function getBook(id: number) {
  return api.get<IBook>(urls.item(id));
}

function createBook(dto: ICreateBookDto) {
  return api.post<IBook>(urls.base, dto);
}

function updateBook({ id, ...dto }: IUpdateBookDto & { id: number }) {
  return api.patch<IBook>(urls.item(id), dto);
}

function deleteBook(id: number) {
  return api.delete<number>(urls.item(id));
}

export const booksApi = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
