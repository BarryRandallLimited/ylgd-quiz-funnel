declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function fbq(...args: unknown[]): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

export function pixelViewContent(params: {
  contentName: string;
  value: number;
  eventId: string;
}): void {
  fbq(
    "track",
    "ViewContent",
    {
      content_name: params.contentName,
      currency: "GBP",
      value: params.value,
    },
    { eventID: params.eventId }
  );
}

export function pixelLead(params: {
  value: number;
  contentName: string;
  eventId: string;
}): void {
  fbq(
    "track",
    "Lead",
    {
      currency: "GBP",
      value: params.value,
      content_name: params.contentName,
    },
    { eventID: params.eventId }
  );
}

export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
