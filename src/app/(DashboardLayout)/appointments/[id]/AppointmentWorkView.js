"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import { completeAppointment } from "@/actions/appointment";
import ServiceRequestOverview from "@/app/(DashboardLayout)/components/ServiceRequestOverview";
import ConfirmModal from "@/app/(DashboardLayout)/components/ConfirmModal";

const errors = {
  work: "Please record the work performed before completing the job.",
  date: "That completion date/time is not valid.",
  signoff: "Please capture the customer's sign-off before completing the job.",
};

const messages = {
  saved: { color: "success", text: "Progress saved." },
  completed: { color: "success", text: "Job marked as completed." },
};

const AppointmentWorkView = ({ request, appointment, services, searchParams }) => {
  const notice =
    (searchParams?.saved && messages.saved) ||
    (searchParams?.completed && messages.completed) ||
    (searchParams?.error && {
      color: "danger",
      text: errors[searchParams.error],
    }) ||
    null;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mode, setMode] = useState("save");
  const formRef = useRef(null);

  // Pre-select the service already recorded on the appointment, otherwise the
  // service on the request.
  const savedService = services.find((s) => s.name === appointment.workPerformed);
  const defaultServiceId = String(savedService?.id ?? request.serviceId ?? "");

  const open = (nextMode) => {
    const form = formRef.current;
    if (form && !form.reportValidity()) return;
    if (nextMode === "submit") {
      const signOff = form
        ?.querySelector('input[name="customerSignOff"]')
        ?.value?.trim();
      if (!signOff) {
        window.alert(
          "Please capture the customer's sign-off before completing the job."
        );
        return;
      }
    }
    setMode(nextMode);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    formRef.current?.requestSubmit();
  };

  const workPanel = (
    <Card className="mb-4 shadow-sm border-primary">
      <CardTitle
        tag="h6"
        className="border-bottom p-3 mb-0 d-flex justify-content-between align-items-center"
      >
        <span>
          <i className="bi bi-check2-square me-2" />
          Record Job Completion
        </span>
        <Button tag={Link} href="/appointments" color="light" size="sm">
          <i className="bi bi-arrow-left me-1" /> My Appointments
        </Button>
      </CardTitle>
      <CardBody>
        {appointment.status === "Completed" ? (
          <Alert color="info">
            This job has been marked completed. You can still update it if
            needed.
          </Alert>
        ) : null}

        <Form action={completeAppointment} innerRef={formRef}>
          <input type="hidden" name="id" value={appointment.id} />
          <input
            type="hidden"
            name="submit"
            value={mode === "submit" ? "1" : "0"}
          />
          <FormGroup>
            <Label for="serviceId">Work Performed (Service)</Label>
            <Input
              id="serviceId"
              name="serviceId"
              type="select"
              defaultValue={defaultServiceId}
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Input>
            <small className="text-muted">
              Pre-set to the requested service — change it if a different
              service was performed.
            </small>
          </FormGroup>
          <FormGroup>
            <Label for="completionNotes">Job Completion Details</Label>
            <Input
              id="completionNotes"
              name="completionNotes"
              type="textarea"
              rows="4"
              placeholder="Notes about the job completion"
              defaultValue={appointment.completionNotes}
            />
          </FormGroup>

          <FormGroup>
            <Label for="customerSignOff">Customer Sign-off</Label>
            <Input
              id="customerSignOff"
              name="customerSignOff"
              type="text"
              placeholder="Name of the customer acknowledging completion"
              defaultValue={appointment.customerSignOff}
            />
            <small className="text-muted">
              Required to mark the job completed — enter the customer's name as
              their acknowledgement of the finished work.
            </small>
          </FormGroup>

          <div className="mt-3 d-flex gap-2 flex-wrap">
            <Button color="secondary" type="button" onClick={() => open("save")}>
              <i className="bi bi-save me-1" /> Save Progress
            </Button>
            <Button color="success" type="button" onClick={() => open("submit")}>
              <i className="bi bi-check-lg me-1" /> Mark Completed
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );

  return (
    <>
      {notice ? <Alert color={notice.color}>{notice.text}</Alert> : null}

      <ServiceRequestOverview
        request={request}
        workPanel={workPanel}
        activeAppointmentId={appointment.id}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        toggle={() => setConfirmOpen(false)}
        title={mode === "submit" ? "Mark job completed" : "Save progress"}
        message={
          mode === "submit"
            ? "Mark this job as completed? The completion date/time will be recorded."
            : "Save your progress on this job?"
        }
        confirmText={mode === "submit" ? "Mark Completed" : "Save"}
        confirmColor={mode === "submit" ? "success" : "primary"}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default AppointmentWorkView;
