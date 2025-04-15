import { useMemo } from "react";

import { useAccount } from "@/providers/AccountProvider.tsx";

export const useAccess = () => {
  const { account } = useAccount();

  return useMemo(() => !!account?.is_admin, [account?.is_admin]);
};
