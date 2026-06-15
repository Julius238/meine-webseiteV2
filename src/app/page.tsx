import { Act1 } from "@/components/sections/Act1";
import { Act2 } from "@/components/sections/Act2";
import { Act3 } from "@/components/sections/Act3";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Act1 />
      <Act2 />
      <Act3 />
      {/* Contact stays a normal scrollable section so the form is usable. */}
      <Contact />
    </>
  );
}
