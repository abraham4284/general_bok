import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BadgeCheck, CircleSlash, FolderKanban } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { GlTransactions } from "../../types/transactions.types";

// import { formatCurrency } from "@/helpers";
type ActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

type TableAccountProps = {
  loading: boolean;
  data: any[];
  deleteAccount?: (id: number) => Promise<void>;
  addDataEdit: (data: any) => void;
  toggleModal: () => void;
  cancelTransaction: (id: number) => Promise<ActionResult<GlTransactions[]>>;
};

export const TableTransactions = ({
  loading,
  data,
  // deleteAccount,
  // addDataEdit,
  // toggleModal,
  cancelTransaction,
}: TableAccountProps) => {
  console.log(data,'data')
  return (
    <Table>
      <TableCaption>Lista de transacciones</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Fecha</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Naturaleza</TableHead>
          <TableHead>Descripcion</TableHead>
          <TableHead>Fuente</TableHead>
          <TableHead>Referencia externa</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Creada</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={2} className="text-center">
              <Spinner />
            </TableCell>
          </TableRow>
        ) : data.length > 0 ? (
          data.map((el) => (
            <TableRow key={el.idGlTransaction}>
              <TableCell className="font-medium">{el.occurred_at}</TableCell>
              <TableCell className="font-medium">{el.category_name}</TableCell>
              <TableCell className="font-medium">{el.nature}</TableCell>
              <TableCell className="font-medium">{el.description}</TableCell>

              <TableCell className="font-medium">{el.source}</TableCell>
              <TableCell className="font-medium">
                {el.external_ref ? el.external_ref : "-"}
              </TableCell>
              <TableCell className="font-medium">
                {el.status === "OK" && (
                  <Badge variant="secondary" className="bg-green-400">
                    <BadgeCheck data-icon="inline-start" />
                    Completado
                  </Badge>
                )}

                {el.status === "ANULADO" && (
                  <Badge variant="destructive" className="bg-red-400">
                    <BadgeCheck data-icon="inline-start" />
                    Anulado
                  </Badge>
                )}
              </TableCell>
              <TableCell className="font-medium">{el.created_at}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link
                    className="bg-blue-500 cursor-pointer px-1.5 py-1.5 rounded-lg"
                    to={`/admin/transaction/${el.idGltransaction}`}
                  >
                    <FolderKanban color="white" strokeWidth={2.5} />
                  </Link>

                  {el.status === "ANULADO" ? (
                    ""
                  ) : (
                    <Button
                      className="bg-red-600 cursor-pointer"
                      title="Anular"
                      onClick={async () =>
                        await cancelTransaction(el.idGltransaction)
                      }
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <CircleSlash color="white" strokeWidth={2.5} />
                      )}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="text-center font-medium">
              Sin datos
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
