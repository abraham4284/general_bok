import { Card, CardContent } from "@/components/ui/card";
import { MapPinCheck, Clock, Hash, UserCheck } from "lucide-react";
import { formatCurrency } from "@/helpers";
import { Spinner } from "@/components/ui/spinner";
import type { GlTransactions } from "../../types/transactions.types";

type CardResumeTransactionsProps = {
  loadingById: boolean;
  transactionById?: GlTransactions[];
};

export const CardResumeTransaction = ({
  loadingById,
}: CardResumeTransactionsProps) => {
  return (
    <>
      {loadingById ? (
        <div className="flex items-center gap-3">
          <Spinner />
        </div>
      ) : (
        <>
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Hash className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Fecha
                  </p>
                  <p className="text-2xl font-bold text-green-600">Fecha</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Descripcion
                  </p>
                  <p className="text-2xl font-bold text-green-600">Descripcion</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <MapPinCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Status
                  </p>
                  <p className="text-2xl font-bold text-green-600">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <MapPinCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Referencia Externa
                  </p>
                  <p className="text-2xl font-bold text-green-600">Referencia Externa</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <MapPinCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Creado
                  </p>
                  <p className="text-2xl font-bold text-green-600">Creado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};
