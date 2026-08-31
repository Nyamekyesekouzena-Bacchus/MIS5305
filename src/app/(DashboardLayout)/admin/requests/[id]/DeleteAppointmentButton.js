"use client";
import { useRef, useState } from "react";
import { Button, Form } from "reactstrap";
import { deleteAppointment } from "@/actions/appointment";
import ConfirmModal from "@/app/(DashboardLayout)/components/ConfirmModal";

const DeleteAppointmentButton = ({ appointment }) => {
  const [open, setOpen] = useState(false);
  const formRef = useRef(null);

  const handleConfirm = () => {
    setOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <Form action={deleteAppointment} innerRef={formRef} className="d-inline">
        <input type="hidden" name="id" value={appointment.id} />
        <input
          type="hidden"
          name="serviceRequestId"
          value={appointment.serviceRequestId}
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
        title="Delete appointment"
        message={`Are you sure you want to delete appointment #${appointment.id}? This cannot be undone.`}
        confirmText="Delete"
        confirmColor="danger"
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default DeleteAppointmentButton;
