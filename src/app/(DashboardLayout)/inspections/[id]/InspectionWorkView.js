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
import { saveFindings } from "@/actions/inspection";
import ServiceRequestOverview from "@/app/(DashboardLayout)/components/ServiceRequestOverview";
import ConfirmModal from "@/app/(DashboardLayout)/components/ConfirmModal";

const errors = {
  findings: "Please record your findings before submitting.",
};

const messages = {
  saved: { color: "success", text: "Progress saved." },
  submitted: { color: "success", text: "Inspection submitted." },
};

const InspectionWorkView = ({ request, inspection, searchParams }) => {
  const notice =
    (searchParams?.saved && messages.saved) ||
    (searchParams?.submitted && messages.submitted) ||
    (searchParams?.error && {
      color: "danger",
      text: errors[searchParams.error],
    }) ||
    null;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mode, setMode] = useState("save");
  const formRef = useRef(null);

  const open = (nextMode) => {
    const form = formRef.current;
    if (form && !form.reportValidity()) return;
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
          <i className="bi bi-pencil-square me-2" />
          Record Inspection Findings
        </span>
        <Button tag={Link} href="/inspections" color="light" size="sm">
          <i className="bi bi-arrow-left me-1" /> My Inspections
        </Button>
      </CardTitle>
      <CardBody>
        {inspection.status === "Submitted" ? (
          <Alert color="info">
            This inspection has been submitted. You can still update it if
            needed.
          </Alert>
        ) : null}

        <Form action={saveFindings} innerRef={formRef}>
          <input type="hidden" name="id" value={inspection.id} />
          <input
            type="hidden"
            name="submit"
            value={mode === "submit" ? "1" : "0"}
          />
          <FormGroup>
            <Label for="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              type="textarea"
              rows="3"
              placeholder="General notes from the inspection"
              defaultValue={inspection.notes}
            />
          </FormGroup>
          <FormGroup>
            <Label for="findings">Findings</Label>
            <Input
              id="findings"
              name="findings"
              type="textarea"
              rows="4"
              placeholder="What did you find during the inspection?"
              defaultValue={inspection.findings}
            />
          </FormGroup>
          <FormGroup>
            <Label for="recommendations">Recommendations</Label>
            <Input
              id="recommendations"
              name="recommendations"
              type="textarea"
              rows="4"
              placeholder="Recommended next steps"
              defaultValue={inspection.recommendations}
            />
          </FormGroup>

          <div className="mt-3 d-flex gap-2 flex-wrap">
            <Button color="secondary" type="button" onClick={() => open("save")}>
              <i className="bi bi-save me-1" /> Save Progress
            </Button>
            <Button color="success" type="button" onClick={() => open("submit")}>
              <i className="bi bi-send me-1" /> Submit Inspection
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
        activeInspection
      />

      <ConfirmModal
        isOpen={confirmOpen}
        toggle={() => setConfirmOpen(false)}
        title={mode === "submit" ? "Submit inspection" : "Save progress"}
        message={
          mode === "submit"
            ? "Submit this inspection? The status will be marked as Submitted."
            : "Save your progress on this inspection?"
        }
        confirmText={mode === "submit" ? "Submit" : "Save"}
        confirmColor={mode === "submit" ? "success" : "primary"}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default InspectionWorkView;
