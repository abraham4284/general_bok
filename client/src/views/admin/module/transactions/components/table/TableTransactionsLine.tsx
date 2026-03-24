import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  CircleSlash } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Link } from "react-router-dom";
import { formatCurrency } from "@/helpers";
// import { formatCurrency } from "@/helpers";
import type { GlTransactionsLine } from "../../types/transactions.types";
import { GetNatureIcon } from "../../helpers/getNatureIcon"

type TableAccountProps = {
  loading: boolean;
  data: GlTransactionsLine[];
  deleteAccount?: (id: number) => Promise<void>;
  addDataEdit?: (data: any) => void;
  toggleModal?: () => void;
};

export const TableTransactionsLine = ({
  loading,
  data,
  // deleteAccount,
  // addDataEdit,
  // toggleModal,
}: TableAccountProps) => {
  console.log(data, "lo que llega");
  return (
    <Table>
      <TableCaption>Lista de transacciones en linea</TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="">Creado</TableHead> */}
          <TableHead>Cuenta</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Naturaleza</TableHead>
          <TableHead>Monto</TableHead>
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
            <TableRow key={el.idGlTransactionLine}>
              {/* <TableCell className="font-medium">{el.created_at}</TableCell> */}
              <TableCell className="font-medium">{el.account_name}</TableCell>
              <TableCell className="font-medium">{el.category_name}</TableCell>
              <TableCell className="font-medium"><GetNatureIcon nature={el.nature}/> </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(el.amount)}
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
