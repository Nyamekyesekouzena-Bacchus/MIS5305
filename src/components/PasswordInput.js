"use client";
import { useState } from "react";
import { Input, InputGroup, Button } from "reactstrap";

// A reactstrap password field with a show/hide toggle. Forwards all props
// (id, name, placeholder, required, etc.) to the underlying Input; the `type`
// is controlled internally so it must not be passed by callers.
const PasswordInput = ({ type, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup>
      <Input type={visible ? "text" : "password"} {...props} />
      <Button
        type="button"
        color="light"
        className="border"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        tabIndex={-1}
      >
        <i className={`bi ${visible ? "bi-eye-slash" : "bi-eye"}`} />
      </Button>
    </InputGroup>
  );
};

export default PasswordInput;
