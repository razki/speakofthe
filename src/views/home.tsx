import { RobotProvider, RobotView } from "@/components/common/robot-view";
import { CortexHero } from "@/components/hero/cortex-hero";
import { homeContent } from "@/data/mocks/home";
import { studioContent } from "@/data/mocks/studio";
import { clientLogosContent } from "@/data/mocks/clients";
import { StudioSections } from "@/components/hero/studio-sections";
import { RibbonBackground } from "@/components/hero/ribbon-background";
import { ribbonBackgroundContent } from "@/data/mocks/ribbon-background";

/**
 * Home view — Server Component for route `/`.
 *
 * Delegates to the {@link CortexHero} client coordinator, passing all content
 * (nav, copy, wordmark, WebGL scene config) as data. Keeps the route → view →
 * client-leaf boundary intact.
 */
/** `robot`: the proxy's robot form (D-016) — same content, at rest. */
export const HomeView = ({ robot = false }: { robot?: boolean }) => {
  return (
    <RobotProvider robot={robot}>
      {robot ? <RobotView /> : null}
      <main id="main" className="w-full bg-hero-bg font-sans text-hero-ink">
        <CortexHero content={homeContent} robot={robot} />
        <div className="relative isolate">
          <RibbonBackground content={ribbonBackgroundContent} />
          <StudioSections content={studioContent} clients={clientLogosContent} />
        </div>
      </main>
    </RobotProvider>
  );
};
