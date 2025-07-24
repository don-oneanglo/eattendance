
import { getAllTeachers } from "@/lib/mock-data";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const teachers = await getAllTeachers();

  return <LoginForm teachers={teachers} />;
}
