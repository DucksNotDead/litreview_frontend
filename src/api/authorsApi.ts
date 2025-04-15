import { api } from "@/api/index.ts";
import { IAuthor } from "@/globals/types.ts";

export interface ICreateAuthorDto {
  fio: string;
  description?: string | null;
  birth_date?: string | null;
  death_date?: string | null;
}

const urls = {
  base: "/authors",
  find(dto?: { fio: string }) {
    if (!dto?.fio) {
      return `${this.base}`;
    }

    return `${this.base}?fio=${dto.fio}`;
  },
  item(id: number) {
    return `${urls.base}/${id}`;
  },
};

function getAuthors(dto: { fio: string }) {
  return api.get<IAuthor[]>(urls.find(dto));
}

function createAuthor(dto: ICreateAuthorDto) {
  return api.post(urls.base, dto);
}

function removeAuthor(id: number) {
  return api.delete<IAuthor[]>(urls.item(id));
}

export const authorsApi = { getAuthors, createAuthor, removeAuthor };
