"use client";
import { useRef, useState } from "react";
import { Button, Form } from "reactstrap";
import { deleteInspection } from "@/actions/inspection";
import ConfirmModal from "@/app/(DashboardLayout)/components/ConfirmModal";

const DeleteInspectionButton = ({ inspection }) => {
  const [open, setOpen] = useState(false);
  const formRef = useRef(null);

  const handleConfirm = () => {
    setOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <Form action={deleteInspection} innerRef={formRef} className="d-inline">
        <input type="hidden" name="id" value={inspection.id} />
        <input
          type="hidden"
          name="serviceRequestId"
          value={inspection.serviceRequestId}
        />
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
        title="Delete inspection"
        message={`Are you sure you want to delete inspection #${inspection.id}? This cannot be undone.`}
        confirmText="Delete"
        confirmColor="danger"
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default DeleteInspectionButton;
