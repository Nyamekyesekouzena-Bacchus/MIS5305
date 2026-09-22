"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import { updateInspection } from "@/actions/inspection";
import ConfirmModal from "@/app/(DashboardLayout)/components/ConfirmModal";

const errors = {
  missing: "Please choose an inspection date and time.",
  invalid: "That date/time is not valid.",
  past: "The inspection cannot be scheduled in the past.",
  assignees: "Please assign at least one field worker.",
  conflict:
    "One or more selected field workers are already booked for another inspection around that time.",
};

const EditInspectionForm = ({
  inspection,
  fieldWorkers,
  minDate,
  searchParams,
}) => {
  const error = searchParams?.error;
  const errorText = error ? errors[error] : null;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef(null);

  const requestSave = () => {
    const form = formRef.current;
    if (form && !form.reportValidity()) return;
    if (!form.querySelector('input[name="assigneeIds"]:checked')) {
      window.alert("Please assign at least one field worker.");
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <Row>
      <Col md="8" lg="6">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-pencil-square me-2"> </i>
            Edit Inspection
          </CardTitle>
          <CardBody>
            <CardSubtitle className="mb-3 text-muted" tag="h6">
              Request #{inspection.serviceRequestId} — {inspection.customerName} (
              {inspection.serviceName})
            </CardSubtitle>

            {errorText ? <Alert color="danger">{errorText}</Alert> : null}

            <Form action={updateInspection} innerRef={formRef}>
              <input type="hidden" name="id" value={inspection.id} />
              <input
                type="hidden"
                name="serviceRequestId"
                value={inspection.serviceRequestId}
              />
              <FormGroup>
                <Label for="scheduledDate">Inspection Date &amp; Time</Label>
                <Input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="datetime-local"
                  min={minDate}
                  defaultValue={inspection.scheduledDate}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label className="d-block">Assign Field Workers</Label>
                {fieldWorkers.map((w) => (
                  <FormGroup check key={w.id} className="mb-1">
                    <Input
                      id={`worker-${w.id}`}
                      name="assigneeIds"
                      type="checkbox"
                      value={w.id}
                      defaultChecked={w.assigned}
                    />
                    <Label check for={`worker-${w.id}`}>
                      {w.name} <span className="text-muted">(@{w.username})</span>
                    </Label>
                  </FormGroup>
                ))}
              </FormGroup>

              <div className="mt-3">
                <Button
                  color="primary"
                  type="button"
                  className="me-2"
                  onClick={requestSave}
                >
                  Save Changes
                </Button>
                <Button
                  tag={Link}
                  href={`/admin/requests/${inspection.serviceRequestId}`}
                  color="light"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>

      <ConfirmModal
        isOpen={confirmOpen}
        toggle={() => setConfirmOpen(false)}
        title="Save changes"
        message="Save changes to this inspection?"
        confirmText="Save"
        confirmColor="primary"
        onConfirm={handleConfirm}
      />
    </Row>
  );
};

export default EditInspectionForm;
