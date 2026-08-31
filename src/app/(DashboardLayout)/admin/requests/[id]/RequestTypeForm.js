"use client";
import { useState } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Badge,
} from "reactstrap";
import { setRequestType } from "@/actions/requestType";

const DURATIONS = [3, 6, 9, 12, 18, 24];

// Admin panel to classify a request as a Job or Contract. Only usable once the
// inspection is done; otherwise a locked message is shown.
const RequestTypeForm = ({ request, inspectionDone }) => {
  const existing = request.requestType;
  const [type, setType] = useState(existing?.type || "Job");
  const [duration, setDuration] = useState(existing?.durationMonths || 6);

  const startDefault = existing?.startDate
    ? new Date(existing.startDate).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return (
    <Card className="mt-4 shadow-sm border-warning">
      <CardTitle
        tag="h6"
        className="border-bottom p-3 mb-0 d-flex justify-content-between align-items-center"
      >
        <span>
          <i className="bi bi-tags me-2" />
          Request Type
        </span>
        {existing ? (
          <Badge color={existing.type === "Contract" ? "primary" : "info"}>
            {existing.type}
            {existing.type === "Contract" && existing.durationMonths
              ? ` · ${existing.durationMonths} months`
              : ""}
          </Badge>
        ) : (
          <Badge color="secondary">Not classified</Badge>
        )}
      </CardTitle>
      <CardBody>
        {!inspectionDone ? (
          <p className="text-muted mb-0 py-2">
            <i className="bi bi-lock me-2" />
            The request type can only be set after the inspection has been
            completed.
          </p>
        ) : (
          <Form action={setRequestType}>
            <input type="hidden" name="serviceRequestId" value={request.id} />
            <Row className="g-3">
              <Col md="4">
                <FormGroup>
                  <Label for="type">Classification</Label>
                  <Input
                    type="select"
                    id="type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Job">Job (single appointment)</option>
                    <option value="Contract">
                      Contract (recurring appointments)
                    </option>
                  </Input>
                </FormGroup>
              </Col>

              {type === "Contract" ? (
                <>
                  <Col md="4">
                    <FormGroup>
                      <Label for="durationMonths">Contract Length</Label>
                      <Input
                        type="select"
                        id="durationMonths"
                        name="durationMonths"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                      >
                        {DURATIONS.map((m) => (
                          <option key={m} value={m}>
                            {m} months
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label for="startDate">Start Date</Label>
                      <Input
                        type="date"
                        id="startDate"
                        name="startDate"
                        defaultValue={startDefault}
                      />
                    </FormGroup>
                  </Col>
                </>
              ) : null}
            </Row>

            <Button color="primary" type="submit">
              <i className="bi bi-check-lg me-1" />
              {existing ? "Update Type" : "Set Type"}
            </Button>
          </Form>
        )}
      </CardBody>
    </Card>
  );
};

export default RequestTypeForm;
