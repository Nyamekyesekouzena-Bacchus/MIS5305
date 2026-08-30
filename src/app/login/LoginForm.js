"use client";
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
import { login } from "@/actions/auth";

const LoginForm = ({ hasError }) => {
  return (
    <Card style={{ width: "100%", maxWidth: "400px" }} className="shadow">
      <CardBody className="p-4">
        <CardTitle tag="h4" className="mb-4 text-center">
          Sign In
        </CardTitle>
        {hasError ? (
          <Alert color="danger">Invalid username or password.</Alert>
        ) : null}
        <Form action={login}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter your username"
              type="text"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="Enter your password"
              type="password"
              required
            />
          </FormGroup>
          <Button color="primary" className="w-100 mt-2" type="submit">
            Sign In
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default LoginForm;
