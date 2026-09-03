import { createFileRoute } from "@tanstack/react-router";
import { AmocSandbox } from "@/components/amoc/sandbox";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <AmocSandbox />;
}
