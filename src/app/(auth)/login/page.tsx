import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login - SaaS Dashboard",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return <LoginForm />;
}
