import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";
import React from "react";
import { TrashBin2 } from "@solar-icons/react";

import { IReview } from "@/globals/types.ts";
import { Mark } from "@/components/Mark.tsx";
import { useAccess } from "@/hooks/useAccess.ts";

interface IReviewCardProps {
  review: IReview;
  onDelete: () => void;
}

export function ReviewCard({
  review,
  onDelete,
}: IReviewCardProps): React.ReactNode {
  const cahEdit = useAccess();

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-md font-bold text-gray-900">{review.title}</h2>
        <div className="flex items-center gap-1 text-yellow-500 gap-4">
          {cahEdit && (
            <Button
              isIconOnly
              color={"danger"}
              size={"sm"}
              variant={"flat"}
              onPress={onDelete}
            >
              <TrashBin2 />
            </Button>
          )}
          <Mark value={review.mark} />
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-gray-700 text-sm mb-4 flex-1">{review.body}</p>
      </CardBody>
      <CardFooter className="flex justify-between items-center text-sm text-gray-600">
        <p>{review.creator.fio}</p>
        <p>{new Date(review.created_date).toLocaleDateString()}</p>
      </CardFooter>
    </Card>
  );
}
