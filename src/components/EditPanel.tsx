import { TrashBin2 } from "@solar-icons/react";
import { Button } from "@heroui/react";

interface EditPanelProps {
  hasAccess: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const EditPanel: React.FC<EditPanelProps> = ({
  hasAccess,
  canDelete,
  onDelete,
}) => {
  return (
    hasAccess && (
      <div className={"flex gap-2"}>
        {/*{canEdit && (*/}
        {/*  <Button*/}
        {/*    isIconOnly*/}
        {/*    color={"warning"}*/}
        {/*    size={"sm"}*/}
        {/*    variant={"flat"}*/}
        {/*    onPress={onEdit}*/}
        {/*  >*/}
        {/*    <Pen2 size={16} />*/}
        {/*  </Button>*/}
        {/*)}*/}
        {canDelete && (
          <Button
            isIconOnly
            color={"danger"}
            size={"sm"}
            variant={"flat"}
            onPress={onDelete}
          >
            <TrashBin2 size={16} />
          </Button>
        )}
      </div>
    )
  );
};
