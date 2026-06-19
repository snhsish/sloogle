import AuthCard from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, MailIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen h-full w-full flex flex-col md:flex-row md:justify-between gap-10">
      <div className="w-full bg-primary/5 flex flex-col justify-center items-center gap-5 p-5">
        <div className="w-md flex flex-col gap-4 items">
          <h1 className="text-6xl font-semibold tracking-tighter">
            <span className="text-[#E01E5A]">S</span>
            <span className="text-[#2EB67D]">l</span>
            <span className="text-[#ECB22E]">o</span>
            <span>o</span>
            <span>g</span>
            <span className="text-[#36C5F0]">l</span>
            <span className="text-[#2EB67D]">e</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Publish Slack messages as searchable web pages to boost your community&apos;s visibility on Search Engines and AI web search tool calls.
          </p>
        </div>

        <AuthCard />
      </div>

      <div className="w-full p-5">
        a
      </div>
    </main>
  )
}