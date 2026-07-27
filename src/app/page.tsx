import { redirect } from "next/navigation";

// Entry point: the dashboard guard bounces unauthenticated visitors to /login.
export default function Home() {
  redirect("/dashboard");
}
