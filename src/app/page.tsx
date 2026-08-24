import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Rings, ScrollSync } from "@/components/site/Fx";
import { Hero, Manifesto, Verdicts, Sixteen, FieldData, HowItKnows, Cta } from "@/components/site/Sections";
import { Story } from "@/components/site/Story";
import { Output } from "@/components/site/Output";
import { ScrollCompanion } from "@/components/Pokeball";
import { readOutput } from "@/lib/content";

export default function Home() {
  // the receipts section prints this verbatim - captured from a real run
  const live = readOutput("check-live.txt");

  return (
    <>
      <Rings />
      <Nav />
      <main id="main">
        <Hero />
        <Manifesto />
        <Story />
        <Verdicts />
        <Sixteen />
        <FieldData />
        <HowItKnows />
        <Output live={live} />
        <Cta />
      </main>
      <Footer />
      <ScrollCompanion />
      <ScrollSync />
    </>
  );
}
