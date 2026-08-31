import { getCurrentUser } from "@/lib/auth";
import FullLayoutClient from "./FullLayoutClient";

export const dynamic = "force-dynamic";

const FullLayout = async ({ children }) => {
  const user = await getCurrentUser();
  const role = user?.role?.name ?? "";

  return <FullLayoutClient role={role}>{children}</FullLayoutClient>;
};

export default FullLayout;
