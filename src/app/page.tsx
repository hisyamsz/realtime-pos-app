import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Realtime POS Apps",
  description: "",
};

export default function Home() {
  return (
    <div>
      <Input />
      <Button>Hello</Button>
      <DarkmodeToggle />
    </div>
  );
}
