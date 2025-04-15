import { AxiosResponse } from "axios";

import { api } from "@/api/index.ts";
import { IReview } from "@/globals/types.ts";

export interface ICreateReviewDto {
  book_id: number;
  title: string;
  body: string;
  mark: number;
}

const urls = {
  base: "/reviews",
  item(id: number) {
    return `${this.base}/${id}`;
  },
  byBook(id?: number) {
    return `${this.base}/${id}`;
  },
};

function getReviews(id?: number) {
  return (id ? api.get<IReview[]>(urls.byBook(id)) : []) as Promise<
    AxiosResponse<IReview[], any>
  >;
}

function createReview(dto: ICreateReviewDto) {
  return api.post<IReview>(urls.base, dto);
}

function deleteReview(id: number) {
  return api.delete<IReview>(urls.item(id));
}

export const reviewsApi = { getReviews, createReview, deleteReview };
