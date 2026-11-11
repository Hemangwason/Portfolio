import { EntranceIntro } from "./components/entrance/EntranceIntro";
import { GlobeSection } from "./components/globe/GlobeSection";
import { AboutPanel } from "./components/sections/AboutPanel";
import { ContactClose } from "./components/sections/ContactClose";

export default function Home() {
  return (
    <main id="top" className="relative flex w-full flex-col">
      <EntranceIntro />
      <GlobeSection />
      <AboutPanel />
      <ContactClose />
    </main>
  );
}
