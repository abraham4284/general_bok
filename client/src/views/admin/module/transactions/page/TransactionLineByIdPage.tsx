import { useParams } from "react-router-dom";
import { useGltransactions } from "../hooks/useGlTransaction.method";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardResumeTransaction, TableTransactionsLine } from "../components";

export const TransactionLineByIdPage = () => {
  const { id } = useParams();
  const {
    transactionsLineById,
    getTransactionsLineById,
    loadingTransactionsLineById,
    // errorTransactionsLineById,
    getTransactionsById,
    transactionsById,
    setLoadingTransactionsById,
    resetGlTransactionsLineById,
    resetGlTransactionsById,
  } = useGltransactions();

  useEffect(() => {
    if (id) {
      getTransactionsLineById(parseInt(id));
      getTransactionsById(parseInt(id));
      return () => {
        resetGlTransactionsLineById();
        resetGlTransactionsById();
      };
    }
  }, [id]);



  return (
    <section>
      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      </div> */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Transaccion n</h2>
        </div>

        <CardResumeTransaction
          loadingById={false}
          transactionById={transactionsById}
        />
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Transacciones en linea</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <div className="overflow-x-auto">
            <TableTransactionsLine
              loading={loadingTransactionsLineById}
              data={transactionsLineById}
              //   addDataEdit={addDataEdit}
              //   toggleModal={toggleModal}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
