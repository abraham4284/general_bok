import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, CircleSlash } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
// import { formatCurrency } from "@/helpers";

type TableAccountProps = {
  loading: boolean;
  data: any[];
  deleteAccount?: (id: number) => Promise<void>;
  addDataEdit: (data: any) => void;
  toggleModal: () => void;
};

export const TableTransactions = ({
  loading,
  data,
  // deleteAccount,
  addDataEdit,
  toggleModal,
}: TableAccountProps) => {
  return (
    <Table>
      <TableCaption>Lista de transacciones</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Fecha</TableHead>
          <TableHead>Descripcion</TableHead>
          <TableHead>Fuente</TableHead>
          <TableHead>Referencia externa</TableHead>
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
            <TableRow key={el.idAccount}>
              <TableCell className="font-medium">{el.occurred_at}</TableCell>
              <TableCell className="font-medium">{el.description}</TableCell>
              <TableCell className="font-medium">{el.source}</TableCell>
              <TableCell className="font-medium">{el.external_reference}</TableCell>
              <TableCell className="font-medium">{el.created_at}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {/* <Button
                    className="bg-yellow-500 cursor-pointer"
                    onClick={() => {
                      addDataEdit(el);
                      toggleModal();
                    }}
                  >
                    <Pencil color="white" strokeWidth={2.5} />
                  </Button> */}

                  <Button
                    className="bg-red-600 cursor-pointer"
                    title="Anular"
                    // onClick={async () => await deleteAccount(el.idAccount)}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <CircleSlash color="white" strokeWidth={2.5} />
                    )}
                  </Button>
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
