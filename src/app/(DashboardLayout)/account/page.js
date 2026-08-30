import { requireUser } from "@/lib/auth";
import AccountView from "./AccountView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Account",
};

export default async function AccountPage({ searchParams }) {
  const user = await requireUser();

  return (
    <AccountView
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role?.name ?? "",
        createdAt: user.createdAt?.toISOString() ?? null,
      }}
      searchParams={searchParams}
    />
  );
}
