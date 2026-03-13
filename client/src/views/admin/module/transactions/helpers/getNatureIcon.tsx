import { TrendingUp, TrendingDown, Package, FolderSync } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type NatureProps = {
  nature: "INCOME" | "EXPENSE" | "ADJUSTMENT" | "TRANSFER" | "OTHER" | string;
};

const getMovementColor = (nature: any) => {
  switch (nature) {
    case "INCOME":
      return "bg-green-100 text-green-800";
    case "EXPENSE":
      return "bg-red-100 text-red-800";
    case "ADJUSTMENT":
      return "bg-blue-100 text-blue-800";
    case "TRANSFER":
      return "bg-blue-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const GetNatureIcon = ({ nature }: NatureProps) => {
  switch (nature) {
    case "INCOME":
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getMovementColor(nature)}`}
        >
          <TrendingUp className="h-4 w-4 text-green-600" />
          {nature}
        </span>
      );
    case "EXPENSE":
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getMovementColor(nature)}`}
        >
          <TrendingDown className="h-4 w-4 text-red-600" />
          {nature}
        </span>
      );
    case "ADJUSTMENT":
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getMovementColor(nature)}`}
        >
          <Package className="h-4 w-4 text-blue-600" />
          {nature}
        </span>
      );
    case "TRANSFER":
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getMovementColor(nature)}`}
        >
          <FolderSync className="h-4 w-4 text-purple-600" />
          {nature}
        </span>
      );
  }
};
