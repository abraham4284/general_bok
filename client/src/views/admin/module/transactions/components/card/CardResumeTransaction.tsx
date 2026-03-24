import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  FileText,
  CheckCircle2,
  XCircle,
  Link2,
  Clock3,
  Database,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { GlTransactions } from "../../types/transactions.types";

type CardResumeTransactionsProps = {
  loadingById: boolean;
  transactionById: GlTransactions[];
};

export const CardResumeTransaction = ({
  loadingById,
  transactionById,
}: CardResumeTransactionsProps) => {
  const transaction = transactionById?.length > 0 ? transactionById[0] : null;

  if (loadingById) {
    return (
      <div className="flex items-center gap-3">
        <Spinner />
        <span className="text-sm text-muted-foreground">
          Cargando resumen de transacción...
        </span>
      </div>
    );
  }

  if (!transaction) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          No hay información disponible para esta transacción.
        </CardContent>
      </Card>
    );
  }

  const { created_at, description, external_ref, occurred_at, source, status } =
    transaction;

  const isOk = status === "OK";
  const fechaDate = new Date(created_at);

  // Nombre del mes (ej: "marzo")
  const mesNombre = fechaDate.toLocaleDateString("es-ES", { month: "long" });

  // Hora en formato 14:30
  const horaFormateada = fechaDate.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const dia = fechaDate.getDate();
  const anio = fechaDate.getFullYear();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <CalendarDays className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">Fecha</p>
              <p className="text-lg md:text-xl font-bold text-blue-700 truncate">
                {occurred_at || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-violet-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-100 rounded-xl">
              <FileText className="h-6 w-6 text-violet-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Descripción
              </p>
              <p className="text-lg md:text-xl font-bold text-violet-700 truncate">
                {description || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`hover:shadow-md transition-shadow duration-200 border-l-4 ${
          isOk ? "border-l-green-500" : "border-l-red-500"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                isOk ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {isOk ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Estado
              </p>

              <div className="mt-1">
                <Badge
                  className={
                    isOk
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : "bg-red-100 text-red-700 hover:bg-red-100"
                  }
                >
                  {isOk ? "Completado" : "Anulado"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-amber-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Link2 className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Referencia externa
              </p>
              <p className="text-lg md:text-xl font-bold text-amber-700 truncate">
                {external_ref || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-sky-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-100 rounded-xl">
              <Clock3 className="h-6 w-6 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Creado
              </p>
              <p className="text-lg md:text-xl font-bold text-sky-700 truncate">
                {/* {created_at || "-"} */}
                {`${dia} de ${mesNombre} de ${anio}, ${horaFormateada}`}
              
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-cyan-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-100 rounded-xl">
              <Database className="h-6 w-6 text-cyan-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Fuente
              </p>
              <p className="text-lg md:text-xl font-bold text-cyan-700 truncate">
                {source || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
