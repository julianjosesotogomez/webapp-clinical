import { redirect } from "next/navigation";

// The dashboard lands on the leads list.
export default function DashboardHome() {
  redirect("/dashboard/leads");
}
