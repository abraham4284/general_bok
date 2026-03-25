import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  FileText,
  XCircle,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { GlTransactions } from "../../types/transactions.types";

type CardResumeTransactionsProps = {
  loading: boolean;
  transactions: GlTransactions[];
};

export const CardMetricTransactions = ({
  loading,
  transactions,
}: CardResumeTransactionsProps) => {
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <Spinner />
        <span className="text-sm text-muted-foreground">
          Cargando resumen de transacción...
        </span>
      </div>
    );
  }

  if (!transactions) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          No hay información disponible para esta transacción.
        </CardContent>
      </Card>
    );
  }
  
  const transactionQuantity = transactions.length;
  const transactionOk = transactions
    ? transactions.filter((el) => el.status === "OK").length
    : 0;
  const transactionsAnulate = transactions
    ? transactions.filter((el) => el.status === "ANULADO").length
    : 0;
 
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4">
      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-violet-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-100 rounded-xl">
              <FileText className="h-6 w-6 text-violet-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Cantidad
              </p>
              <p className="text-lg md:text-xl font-bold text-violet-700 truncate">
                 {transactionQuantity}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Completados
              </p>
              <p className="text-lg md:text-xl font-bold text-green-700 truncate">
                 {transactionOk}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Anulados
              </p>
              <p className="text-lg md:text-xl font-bold text-red-700 truncate">
                 {transactionsAnulate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

     
    </div>
  );
};
