"use client";
import { useRef, useState } from "react";
import { Button, Form } from "reactstrap";
import { softDeleteUser } from "@/actions/admin";
import ConfirmModal from "../../components/ConfirmModal";

const DeleteUserButton = ({ user }) => {
  const [open, setOpen] = useState(false);
  const formRef = useRef(null);

  const handleConfirm = () => {
    setOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <Form action={softDeleteUser} innerRef={formRef} className="d-inline">
        <input type="hidden" name="id" value={user.id} />
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
        title="Delete user"
        message={`Are you sure you want to delete ${user.firstName} ${user.lastName}? This can be undone by an administrator.`}
        confirmText="Delete"
        confirmColor="danger"
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default DeleteUserButton;
