import { SystemChrome } from "./components/SystemChrome";
import { Entrance } from "./components/Entrance";
import { SignalTicker } from "./components/SignalTicker";
import { Profile } from "./components/Profile";
import { WorkIndex } from "./components/WorkIndex";
import { SignalsStrip } from "./components/SignalsStrip";
import { SitesIndex } from "./components/SitesIndex";
import { ContactFooter } from "./components/ContactFooter";

export default function Home() {
  return (
    <main className="relative flex w-full flex-col">
      <SystemChrome />
      <Entrance />
      <SignalTicker />
      <Profile />
      <WorkIndex />
      <SignalsStrip />
      <SitesIndex />
      <ContactFooter />
    </main>
  );
}
