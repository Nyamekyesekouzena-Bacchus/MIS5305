import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign In",
};

export default function LoginPage({ searchParams }) {
  const hasError = searchParams?.error != null;

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "#f5f7fb" }}
    >
      <LoginForm hasError={hasError} />
    </div>
  );
}
