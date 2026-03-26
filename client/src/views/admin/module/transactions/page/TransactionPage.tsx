import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderAll } from "@/views/admin/components/HeaderAll";
import { useUtilsState } from "@/hooks/useUtilsState";
import { useGltransactions } from "../hooks/useGlTransaction.method";
import {
  CardMetricTransactions,
  ModalFormTransaction,
  TableTransactions,
  CardFilterTransactions,
} from "../components";
import { useAccount } from "../../account/hooks/useAccount.method";
import { useCategory } from "../../category/hooks/useCategory.method";
import type { TransactionFilterState } from "../types/transactions.types";
import { Meta } from "@/components";

export const TransactionPage = () => {
  const {
    createGlTransaction,
    getTransactions,
    loading,
    resetGlTransactions,
    transactions,
    cancelTransaction,
  } = useGltransactions();

  const { accounts, getAccounts, resetAccounts } = useAccount();

  const { category, getCategory, resetCategories } = useCategory();

  const { isOpen, addDataEdit, toggleModal, closeModal, setIsOpen } =
    useUtilsState();

  const initialFilters: TransactionFilterState = {
    date: "",
    fromDate: "",
    toDate: "",
    categoryId: "",
    nature: "",
  };

  const [filters, setFilters] =
    useState<TransactionFilterState>(initialFilters);

  const handleChangeFilter = (
    field: keyof TransactionFilterState,
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleCreate = () => {
    addDataEdit(null);
    toggleModal();
  };

  useEffect(() => {
    getTransactions();
    getCategory();
    return () => {
      resetGlTransactions();
    };
  }, []);

  useEffect(() => {
    getAccounts();
    getCategory();
    return () => {
      resetAccounts();
      resetCategories();
    };
  }, [isOpen]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = transaction.occurred_at?.slice(0, 10) || "";
      const transactionCategoryId = String(transaction.idGlCategorie ?? "");
      const transactionNature = transaction.nature ?? "";

      const matchExactDate = filters.date
        ? transactionDate === filters.date
        : true;

      const matchFromDate = filters.fromDate
        ? transactionDate >= filters.fromDate
        : true;

      const matchToDate = filters.toDate
        ? transactionDate <= filters.toDate
        : true;

      const matchCategory = filters.categoryId
        ? transactionCategoryId === filters.categoryId
        : true;

      const matchNature = filters.nature
        ? transactionNature === filters.nature
        : true;

      return (
        matchExactDate &&
        matchFromDate &&
        matchToDate &&
        matchCategory &&
        matchNature
      );
    });
  }, [transactions, filters]);

  return (
    <>
      <Meta
        title="Transacciones"
        description="Gestiona ingresos, egresos y movimientos"
      />
      <section className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <HeaderAll
            title="Gestión de transacciones"
            subTitle="Gestiona el control de tus transacciones"
            handleCreate={handleCreate}
            btnInfo="Nueva Transacción"
          />
        </div>

        <div className="space-y-4">
          <CardMetricTransactions
            loading={loading}
            transactions={filteredTransactions}
          />
        </div>

        <div>
          <CardFilterTransactions
            filters={filters}
            category={category}
            onChangeFilter={handleChangeFilter}
            onResetFilters={handleResetFilters}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transacciones</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <div className="overflow-x-auto">
              <TableTransactions
                loading={loading}
                data={filteredTransactions}
                addDataEdit={addDataEdit}
                toggleModal={toggleModal}
                cancelTransaction={cancelTransaction}
              />
            </div>
          </CardContent>
        </Card>

        <ModalFormTransaction
          openModal={isOpen}
          loading={loading}
          setOpenModal={setIsOpen}
          createTransaction={createGlTransaction}
          closeModal={closeModal}
          addDataEdit={addDataEdit}
          accounts={accounts}
          category={category}
        />
      </section>
    </>
  );
};
