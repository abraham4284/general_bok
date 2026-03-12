import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderAll } from "@/views/admin/components/HeaderAll";
// import { useCategory } from "../hooks/useCategory.method";
import { useUtilsState } from "@/hooks/useUtilsState";
import { useGltransactions } from "../hooks/useGlTransaction.method";
import { ModalFormTransaction, TableTransactions } from "../components";
import { useAccount } from "../../account/hooks/useAccount.method";
import { useCategory } from "../../category/hooks/useCategory.method";
// import {
//   CardFilterCategory,
//   ModalFormCategory,
//   TableCategory,
// } from "../components";
// import type { Category } from "../types/category.types"

export const TransactionPage = () => {
  const {
    createGlTransaction,
    error,
    getTransactions,
    loading,
    resetGlTransactions,
    transactions,
  } = useGltransactions();

  const {
    accounts,
    getAccounts,
    error: errorAccount,
    loading: loadingAccount,
    resetAccounts,
  } = useAccount();

  const {
    category,
    getCategory,
    error: errorCategory,
    loading: loadingCategory,
    resetCategories,
  } = useCategory();

  const {
    isOpen,
    dataEdit,
    addDataEdit,
    toggleModal,
    closeModal,
    setIsOpen,
    // toggleModalAndSetDataEdit,
  } = useUtilsState();
  // const [categoryFilter, setCategoryFilter] = useState<Category[]>([]);

  // const handleFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   const searchInput = e.target.value.toLocaleLowerCase();
  //   if (searchInput === "") {
  //     setCategoryFilter([]);
  //   } else {
  //     const filterCategory = category.filter((el) => {
  //       return el.name.toLocaleLowerCase().includes(searchInput);
  //     });
  //     setCategoryFilter(filterCategory);
  //   }
  // };

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

  // const categoryDef = categoryFilter.length === 0 ? category : categoryFilter;

  return (
    <section className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <HeaderAll
          title={"Gestión de transacciones"}
          subTitle={"Gestiona el control de tus transacciones"}
          handleCreate={handleCreate}
          btnInfo="Nueva Transacción"
        />
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {/* <CardMetricAccount metric={metric} loading ={loading} /> */}
      </div>

      {/* Filtros y búsqueda */}
      <div>
        {/* <CardFilterCategory handleFilterInput={handleFilterInput} /> */}
      </div>

      {/* Tabla de categorías */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <div className="overflow-x-auto">
            <TableTransactions
              loading={loading}
              data={transactions}
              // deleteAccount={deleteAccount}
              addDataEdit={addDataEdit}
              toggleModal={toggleModal}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal para crear/editar */}
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
  );
};
