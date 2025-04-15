import axios from "axios";

import { BASE_API_URL } from "@/globals/consts.ts";

export const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});
