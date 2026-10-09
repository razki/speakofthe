export interface CareersBackgroundContent {
  video: string;
  poster: string;
}

export interface CareersContent {
  title: string;
  availability: string;
  description: string;
  homeLabel: string;
  skipLabel: string;
  metadataTitle: string;
  metadataDescription: string;
  background: CareersBackgroundContent;
}

export const careersContent: CareersContent = {
  title: "Careers",
  availability: "No vacancies available at the moment.",
  description: "Please check back for future opportunities.",
  homeLabel: "Back to home",
  skipLabel: "Skip to content",
  metadataTitle: "Careers - SPEAKOFTHE.",
  metadataDescription:
    "There are no vacancies available at SPEAKOFTHE. at the moment. Please check back for future opportunities.",
  background: {
    video: "/assets/backgrounds/coral-light-arc-1080.mp4",
    poster: "/assets/backgrounds/coral-light-arc-poster.webp",
  },
};
