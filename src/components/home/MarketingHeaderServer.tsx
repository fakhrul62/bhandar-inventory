import { getSessionUser } from "@/lib/auth";
import { MarketingHeader } from "@/components/home/MarketingHeader";

export async function MarketingHeaderServer() {
  const user = await getSessionUser();
  const email = user?.email || "";
  const fullName =
    (user?.user_metadata?.name as string | undefined) ||
    (user?.user_metadata?.full_name as string | undefined) ||
    email.split("@")[0] ||
    "";
  const firstName = fullName.trim().split(/\s+/)[0] || "Account";

  return (
    <MarketingHeader
      user={
        user
          ? {
              firstName,
              email,
              avatarUrl: (user.user_metadata?.avatar_url as string | undefined) || null,
            }
          : null
      }
    />
  );
}
