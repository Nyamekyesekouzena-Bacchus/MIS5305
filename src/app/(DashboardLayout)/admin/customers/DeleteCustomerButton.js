"use client";
import { useRef, useState } from "react";
import { Button, Form } from "reactstrap";
import { deleteCustomer } from "@/actions/customer";
import ConfirmModal from "../../components/ConfirmModal";

const DeleteCustomerButton = ({ customer }) => {
  const [open, setOpen] = useState(false);
  const formRef = useRef(null);

  const handleConfirm = () => {
    setOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <Form action={deleteCustomer} innerRef={formRef} className="d-inline">
        <input type="hidden" name="id" value={customer.id} />
        <Button
          color="danger"
          size="sm"
          type="button"
          onClick={() => setOpen(true)}
        >
          <i className="bi bi-trash" /> Delete
        </Button>
      </Form>
      <ConfirmModal
        isOpen={open}
        toggle={() => setOpen(false)}
        title="Delete customer"
        message={`Are you sure you want to permanently delete ${customer.name}? This cannot be undone.`}
        confirmText="Delete"
        confirmColor="danger"
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default DeleteCustomerButton;
