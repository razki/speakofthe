export interface StudioLink {
  label: string;
  href: string;
}

export interface StudioService {
  number: string;
  title: string;
  description: string;
}

export interface StudioAboutBlock {
  title: string;
  description: string;
}

export interface ContactDirectionMotion {
  tension: number;
  friction: number;
  mass: number;
  pauseDuration: number;
}

export interface StudioContent {
  services: {
    title: string;
    items: StudioService[];
  };
  about: {
    title: string;
    introduction: string;
    blocks: StudioAboutBlock[];
  };
  contact: {
    title: string;
    direction: ContactDirectionMotion;
    email: {
      reveal: string;
      loading: string;
      error: string;
      retry: string;
    };
  };
  footer: {
    brand: string;
    companyDetails: string;
    navigationLabel: string;
    links: StudioLink[];
  };
}

/** Site copy supplied and reviewed by the owner. */
export const studioContent: StudioContent = {
  services: {
    title: "From discovery to delivery.",
    items: [
      {
        number: "01",
        title: "Discovery & Design",
        description:
          "Undertaking greenfield projects, existing digital transformation work or speculative ideas. Cloud-first architecture and design input.",
      },
      {
        number: "02",
        title: "Development & Stability",
        description:
          "Open-source technology and cloud infrastructure empowering robust and scalable applications.",
      },
      {
        number: "03",
        title: "Delivery & Support Handover",
        description:
          "Intuitive design and software, coupled with tailored training and continuous support packages.",
      },
    ],
  },
  about: {
    title: "A personal touch.",
    introduction:
      "Established in 2021, SPEAK OF THE LTD is a Software Consultancy based in North Yorkshire.",
    blocks: [
      {
        title: "Who we are",
        description: "A small software consultancy team with a personal touch.",
      },
      {
        title: "What we do",
        description:
          "Engage with various clients throughout many business sectors; Gambling, Defence, Public, Telecoms, eCommerce, and Media/Live-streaming. To maintain, uplift, and design new solutions to client requirements and specifications.",
      },
    ],
  },
  contact: {
    title: "Get in touch",
    direction: {
      tension: 35,
      friction: 20,
      mass: 1,
      pauseDuration: 1600,
    },
    email: {
      reveal: "Reveal email address",
      loading: "Revealing email…",
      error: "Unable to reveal the email address. Please try again.",
      retry: "Try again",
    },
  },
  footer: {
    brand: "SPEAKOFTHE.",
    companyDetails:
      "Company No: 12426635 · VAT No: 392725275",
    navigationLabel: "Company links",
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/speakofthe",
      },
      { label: "Careers", href: "/careers" },
    ],
  },
};
