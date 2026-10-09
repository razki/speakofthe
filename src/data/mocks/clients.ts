export interface ClientLogo {
  name: string;
  src: string;
  format: "wide" | "square" | "compact";
  /** Intrinsic image dimensions and non-transparent bounds in source pixels. */
  source: { width: number; height: number };
  ink: { x: number; y: number; width: number; height: number };
}

export interface ClientLogosContent {
  title: string;
  pauseLabel: string;
  resumeLabel: string;
  cycleDuration: number;
  companies: ClientLogo[];
}

/** Owner-supplied experience; official asset sources are recorded in the vault. */
export const clientLogosContent: ClientLogosContent = {
  title: "Companies we’ve worked with",
  pauseLabel: "Pause logo scrolling",
  resumeLabel: "Resume logo scrolling",
  cycleDuration: 80000,
  companies: [
    {
      name: "Sky Bet", src: "/assets/clients/sky-bet-mono.png", format: "compact",
      source: { width: 284, height: 90 },
      ink: { x: 4, y: 4, width: 275, height: 82 },
    },
    {
      name: "DAZN", src: "/assets/clients/dazn.svg", format: "square",
      source: { width: 120, height: 120 },
      ink: { x: 0, y: 0, width: 120, height: 120 },
    },
    {
      name: "Gamma Telecom", src: "/assets/clients/gamma.svg", format: "wide",
      source: { width: 284, height: 64 },
      ink: { x: 0, y: 0, width: 283.5, height: 63.625 },
    },
    {
      name: "Transport for Greater Manchester", src: "/assets/clients/tfgm.png", format: "wide",
      source: { width: 235, height: 60 },
      ink: { x: 0, y: 1, width: 235, height: 59 },
    },
    {
      name: "Fanatics Markets", src: "/assets/clients/fanatics-markets.svg", format: "wide",
      source: { width: 135, height: 16 },
      ink: { x: 0, y: 0, width: 135, height: 16 },
    },
    {
      name: "Data Edge Analytics", src: "/assets/clients/data-edge-analytics.svg", format: "wide",
      source: { width: 150, height: 26 },
      ink: { x: 0, y: 0, width: 149.25, height: 26 },
    },
    {
      name: "CreateFuture", src: "/assets/clients/createfuture.svg", format: "wide",
      source: { width: 988, height: 140 },
      ink: { x: 0, y: 0, width: 987.5, height: 139.625 },
    },
    {
      name: "Apergy", src: "/assets/clients/apergy.webp", format: "compact",
      source: { width: 424, height: 233 },
      ink: { x: 6, y: 7, width: 413, height: 217 },
    },
  ],
};
