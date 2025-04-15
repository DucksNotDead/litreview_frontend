import React from "react";

export interface IRoute {
  path: string;
  component: React.ReactNode;
  name: string;
}

export interface IModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCancel: () => void;
}

export interface IPageFormProps {
  onCancel: () => void;
}

export interface IUser {
  id: number;
  email: string;
  fio: string;
  is_admin: boolean;
  description: string | null;
  avatar_url: string | null;
}

export interface IAuthor {
  id: number;
  fio: string;
  description: string | null;
  birth_date: string | null;
  death_date: string | null;
  creator_id: number | null;
  created_date: string | null;
  rating: number;
}

export interface ICategory {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface IBook {
  id: number;
  title: string;
  description: string | null;
  pages_count: number;
  cover_url: string | null;
  created_date: string;
  published_date: string | null;
  creator: IUser | null;
  authors: IAuthor[];
  categories: ICategory[];
  rating: number;
}

export interface IReview {
  id: number;
  book_id: number;
  creator: IUser;
  title: string;
  body: string;
  mark: number;
  created_date: string;
}
