"use client";
import { useRef, useState } from "react";
import { Button, Form } from "reactstrap";
import { deleteRequest } from "@/actions/request";
import ConfirmModal from "../../components/ConfirmModal";

const DeleteRequestButton = ({ request }) => {
  const [open, setOpen] = useState(false);
  const formRef = useRef(null);

  const handleConfirm = () => {
    setOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <Form action={deleteRequest} innerRef={formRef} className="d-inline">
        <input type="hidden" name="id" value={request.id} />
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
        title="Delete request"
        message={`Are you sure you want to permanently delete request #${request.id}? This cannot be undone.`}
        confirmText="Delete"
        confirmColor="danger"
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default DeleteRequestButton;
