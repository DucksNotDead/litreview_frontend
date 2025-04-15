import { useEffect } from "react";

export const useLog = (...args: unknown[]) => {
  useEffect(() => {
    //eslint-disable-next-line
    console.log(...args);
  }, [...args]);
};
