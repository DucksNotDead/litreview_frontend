import { api } from ".";

import { IUser } from "@/globals/types.ts";

export interface IUserRegisterDto {
  email: string;
  password: string;
  fio: string;
  description?: string;
}

export interface IUserLoginDto {
  email: string;
  password: string;
}

const urls = {
  base: "account",
  register() {
    return `${this.base}/register`;
  },
  login() {
    return `${this.base}/login`;
  },
  logout() {
    return `${this.base}/logout`;
  },
};

function auth() {
  return api.post<IUser>(urls.base);
}

function login(dto: IUserLoginDto) {
  return api.post(urls.login(), dto);
}

function register(dto: IUserRegisterDto) {
  return api.post<IUser>(urls.register(), dto);
}

function logout() {
  return api.post(urls.logout());
}

export const accountApi = { auth, register, login, logout };
