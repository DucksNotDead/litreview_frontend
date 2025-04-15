import { CircularProgress } from "@heroui/react";
import { useMemo } from "react";

interface IMarkProps {
  value: number;
}

export const Mark: React.FC<IMarkProps> = ({ value }) => {
  const color = useMemo<"success" | "warning" | "danger">(() => {
    if (value <= 4) return "danger";
    if (value <= 8) return "warning";
    else return "success";
  }, [value]);

  return (
    <CircularProgress
      color={color}
      maxValue={10}
      minValue={1}
      showValueLabel={true}
      value={value}
    />
  );
};
