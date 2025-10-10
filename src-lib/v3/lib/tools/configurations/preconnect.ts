export interface PreconnectConfig {
  href: string;
  crossorigin: boolean;
}

export const preconnectLinks: PreconnectConfig[] = [
  {
    href: "https://fonts.googleapis.com",
    crossorigin: false,
  },
  {
    href: "https://fonts.gstatic.com",
    crossorigin: true,
  },
  // Add more domains as needed
];

export function injectPreconnectLinks(): void {
  for (let preconnectLink of preconnectLinks) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = preconnectLink.href;
    if (preconnectLink.crossorigin) {
      link.crossOrigin = "anonymous";
    }
    document.head.appendChild(link);
  }
}
