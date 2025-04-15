import { AccountModal } from "@/modals/AccountModal.tsx";
import { CreateUpdateModal } from "@/modals/CreateUpdateModal.tsx";
import { ReviewsModal } from "@/modals/ReviewsModal.tsx";

export const modals = {
  account: <AccountModal />,
  set: <CreateUpdateModal />,
  review: <ReviewsModal />,
};
