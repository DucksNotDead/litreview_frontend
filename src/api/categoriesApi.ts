import { api } from "@/api/index.ts";
import { ICategory } from "@/globals/types.ts";

const urls = {
  base: "/categories",
  item(id: number) {
    return `${urls.base}/${id}`;
  },
};

function getCategories() {
  return api.get<ICategory[]>(urls.base);
}

export const categoriesApi = { getCategories };
