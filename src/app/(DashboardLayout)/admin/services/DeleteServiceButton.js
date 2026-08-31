"use client";
import { useRef, useState } from "react";
import { Button, Form } from "reactstrap";
import { deleteService } from "@/actions/service";
import ConfirmModal from "../../components/ConfirmModal";

const DeleteServiceButton = ({ service }) => {
  const [open, setOpen] = useState(false);
  const formRef = useRef(null);

  const handleConfirm = () => {
    setOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <Form action={deleteService} innerRef={formRef} className="d-inline">
        <input type="hidden" name="id" value={service.id} />
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
        title="Delete service"
        message={`Are you sure you want to permanently delete ${service.name}? This cannot be undone.`}
        confirmText="Delete"
        confirmColor="danger"
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default DeleteServiceButton;
