import { useEffect, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@/hooks";
import { NumericFormat } from "react-number-format";
import { Decimal } from "decimal.js";
import { toast, Toaster } from "react-hot-toast";
import type { Account } from "@/views/admin/module/account/types/account.types";
import type { Category } from "@/views/admin/module/category/types/category.types";
import { formatCurrency } from "@/helpers";
import { Textarea } from "@/components/ui/textarea";

type ModalFormTransactionProps = {
  openModal: boolean;
  loading: boolean;
  accounts: Account[];
  category: Category[];
  setOpenModal: (open: boolean) => void;
  createTransaction: (
    payload: any,
  ) => Promise<{ success: boolean; message: string }>;

  closeModal: () => void;
  addDataEdit: (data: any) => void;
};

const initialForm = {
  ocurred_at: "",
  description: "",
  external_ref: "",
  idAccount: "",
  idAccountTo: "",
  idGlCategorie: "",
  amount: "",
};

export const ModalFormTransaction = ({
  openModal,
  loading,
  setOpenModal,
  createTransaction,
  closeModal,
  addDataEdit,
  accounts,
  category,
}: ModalFormTransactionProps) => {
  const {
    ocurred_at,
    description,
    external_ref,
    idAccount,
    idAccountTo,
    idGlCategorie,
    amount,
    onInputChange,
    onResetForm,
    setFormSate,
    formSate,
  } = useForm(initialForm);

  const selectedCategory =
    idGlCategorie && category.length > 0
      ? category.find((el) => String(el.idGlCategorie) === idGlCategorie)
      : null;

  const natureCategorySelected = selectedCategory?.nature ?? "";
  const isTransfer = natureCategorySelected === "TRANSFER";
  const hasCategorySelected = !!selectedCategory;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ocurred_at || !amount) {
      return toast.error("Todos los campos son obligatorios");
    }

    let payload;
    if (natureCategorySelected === "TRANSFER") {
      payload = {
        ocurred_at,
        description,
        external_ref,
        idAccount,
        idAccountTo,
        idGlCategorie,
        amount,
      };
    } else {
      payload = {
        ocurred_at,
        description,
        external_ref,
        idAccount,
        idGlCategorie,
        amount,
      };
    }

    const { success, message } = await createTransaction(payload);
    if (success) {
      closeModal();
      onResetForm();
      toast.success(message);
    } else {
      toast.error(message || "Error al crear la cuenta.");
    }
  };
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Transacción</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Nombre */}
          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              name="ocurred_at"
              value={ocurred_at}
              onChange={onInputChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label>Monto</Label>
            <NumericFormat
              value={amount}
              inputMode="decimal"
              thousandSeparator="."
              decimalSeparator=","
              allowedDecimalSeparators={[","]}
              decimalScale={2}
              allowNegative={false}
              allowLeadingZeros={false}
              onValueChange={(values) => {
                setFormSate({
                  ...formSate,
                  amount: values.value, // ← GUARDAR SIEMPRE ESTE
                });
              }}
              className="mt-2 border rounded-md p-2 w-full"
              disabled={loading}
              placeholder="Ej: 1.372.342,28"
            />
          </div>

          <div>
            <Label>Descripcion</Label>
            <Textarea
              name="description"
              value={description}
              onChange={onInputChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label>Referencia Externa</Label>
            <Input
              name="external_ref"
              value={external_ref}
              onChange={onInputChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="balance">
              Categorias <span className="text-red-500">*</span>
            </Label>
            <Select
              value={idGlCategorie}
              onValueChange={(value) =>
                setFormSate({ ...formSate, idGlCategorie: value })
              }
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                {category.length > 0 ? (
                  category.map((el) => (
                    <SelectGroup key={el.idGlCategorie}>
                      <SelectItem value={String(el.idGlCategorie)}>
                        {el.name} - {el.nature}
                      </SelectItem>
                    </SelectGroup>
                  ))
                ) : (
                  <SelectGroup>
                    <SelectLabel>Sin datos</SelectLabel>
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </div>

          {hasCategorySelected && !isTransfer && (
            <div>
              <Label htmlFor="balance">
                Cuenta <span className="text-red-500">*</span>
              </Label>
              <Select
                value={idAccount}
                onValueChange={(value) =>
                  setFormSate({ ...formSate, idAccount: value })
                }
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.length > 0 ? (
                    accounts.map((el) => (
                      <SelectGroup key={el.idAccount}>
                        <SelectItem value={String(el.idAccount)}>
                          {el.name} - {formatCurrency(el.balance)}
                        </SelectItem>
                      </SelectGroup>
                    ))
                  ) : (
                    <SelectGroup>
                      <SelectLabel>Sin datos</SelectLabel>
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {hasCategorySelected && isTransfer && (
            <>
              <div>
                <Label htmlFor="balance">
                  De <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={idAccount}
                  onValueChange={(value) =>
                    setFormSate({ ...formSate, idAccount: value })
                  }
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.length > 0 ? (
                      accounts.map((el) => (
                        <SelectGroup key={el.idAccount}>
                          <SelectItem value={String(el.idAccount)}>
                            {el.name} - {formatCurrency(el.balance)}
                          </SelectItem>
                        </SelectGroup>
                      ))
                    ) : (
                      <SelectGroup>
                        <SelectLabel>Sin datos</SelectLabel>
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="balance">
                  Para <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={idAccountTo}
                  onValueChange={(value) =>
                    setFormSate({ ...formSate, idAccountTo: value })
                  }
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.length > 0 ? (
                      accounts.map((el) => (
                        <SelectGroup key={el.idAccount}>
                          <SelectItem value={String(el.idAccount)}>
                            {el.name} - {formatCurrency(el.balance)}
                          </SelectItem>
                        </SelectGroup>
                      ))
                    ) : (
                      <SelectGroup>
                        <SelectLabel>Sin datos</SelectLabel>
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="submit" className={"bg-blue-500"}>
              Crear
            </Button>

            <DialogClose asChild>
              <Button variant="outline" onClick={onResetForm}>
                Cancelar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
        <Toaster position="top-right" reverseOrder={false} />
      </DialogContent>
    </Dialog>
  );
};
