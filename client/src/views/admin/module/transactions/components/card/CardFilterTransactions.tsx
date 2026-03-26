import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw } from "lucide-react";
import type { Category } from "@/views/admin/module/category/types/category.types";
import type { TransactionFilterState } from "../../types/transactions.types";


type CardFilterTransactionsProps = {
  filters: TransactionFilterState;
  category: Category[];
  onChangeFilter: (
    field: keyof TransactionFilterState,
    value: string
  ) => void;
  onResetFilters: () => void;
};

export const CardFilterTransactions = ({
  filters,
  category,
  onChangeFilter,
  onResetFilters,
}: CardFilterTransactionsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Filter className="h-5 w-5" />
          Filtros de transacciones
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha exacta</label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => onChangeFilter("date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Desde</label>
            <Input
              type="date"
              value={filters.fromDate}
              onChange={(e) => onChangeFilter("fromDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hasta</label>
            <Input
              type="date"
              value={filters.toDate}
              onChange={(e) => onChangeFilter("toDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoría</label>
            <Select
              value={filters.categoryId || "all"}
              onValueChange={(value) =>
                onChangeFilter("categoryId", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {category.map((item) => (
                  <SelectItem
                    key={item.idGlCategorie}
                    value={String(item.idGlCategorie)}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Naturaleza</label>
            <Select
              value={filters.nature || "all"}
              onValueChange={(value) =>
                onChangeFilter("nature", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar naturaleza" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="INCOME">INCOME</SelectItem>
                <SelectItem value="EXPENSE">EXPENSE</SelectItem>
                <SelectItem value="ADJUSTMENT">ADJUSTMENT</SelectItem>
                <SelectItem value="TRANSFER">TRANSFER</SelectItem>
                <SelectItem value="OTHER">OTHER</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};