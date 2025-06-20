import { RenderUsername } from "@/context/AuthContext";
import TestFirebase from "../../components/TestFirebase";
import SignupForm from "../../components/auth/SignupForm";

export default function Home() {
  return (
    <div>
      <SignupForm />
      <TestFirebase />
      <RenderUsername />
    </div>
  )
}