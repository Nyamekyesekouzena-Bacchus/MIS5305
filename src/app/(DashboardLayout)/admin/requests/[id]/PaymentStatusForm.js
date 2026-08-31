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
import { setPaymentStatus } from "@/actions/payment";
import {
  PAYMENT_STATUS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_COLORS,
} from "@/lib/status.mjs";

// Admin panel to record whether a request has been paid. Only usable once the
// inspection is done; otherwise a locked message is shown.
const PaymentStatusForm = ({ request, inspectionDone }) => {
  const existing = request.paymentStatus;
  const current = existing?.status || PAYMENT_STATUS.NOT_PAID;
  const [status, setStatus] = useState(current);

  return (
    <Card className="mt-4 shadow-sm border-success">
      <CardTitle
        tag="h6"
        className="border-bottom p-3 mb-0 d-flex justify-content-between align-items-center"
      >
        <span>
          <i className="bi bi-cash-coin me-2" />
          Payment Status
        </span>
        <Badge color={PAYMENT_STATUS_COLORS[current] || "secondary"}>
          {current}
        </Badge>
      </CardTitle>
      <CardBody>
        {!inspectionDone ? (
          <p className="text-muted mb-0 py-2">
            <i className="bi bi-lock me-2" />
            The payment status can only be set after the inspection has been
            completed.
          </p>
        ) : (
          <Form action={setPaymentStatus}>
            <input type="hidden" name="serviceRequestId" value={request.id} />
            <Row className="g-3 align-items-end">
              <Col md="6">
                <FormGroup className="mb-0">
                  <Label for="paymentStatus">Payment</Label>
                  <Input
                    type="select"
                    id="paymentStatus"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <Button color="primary" type="submit">
                  <i className="bi bi-check-lg me-1" />
                  {existing ? "Update Payment" : "Set Payment"}
                </Button>
              </Col>
            </Row>
            {existing?.paidAt ? (
              <small className="text-muted d-block mt-2">
                <i className="bi bi-calendar-check me-1" />
                Marked paid on {new Date(existing.paidAt).toLocaleString()}
              </small>
            ) : null}
          </Form>
        )}
      </CardBody>
    </Card>
  );
};

export default PaymentStatusForm;
