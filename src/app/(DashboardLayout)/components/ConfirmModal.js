"use client";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";

const ConfirmModal = ({
  isOpen,
  toggle,
  title = "Please confirm",
  message,
  confirmText = "Confirm",
  confirmColor = "primary",
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        <Button color="light" onClick={toggle}>
          Cancel
        </Button>
        <Button color={confirmColor} onClick={onConfirm}>
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;
