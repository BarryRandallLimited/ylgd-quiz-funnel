import { Check } from "lucide-react";
import { getPackage } from "@/config/packages";
import PayHeader from "@/components/PayHeader";

interface PageProps {
  searchParams: Promise<{ package?: string; session_id?: string }>;
}

export const metadata = {
  title: "Payment Confirmed | Your Local Garden Designer",
};

const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";
const BODY_FONT = "'Inter','Montserrat',sans-serif";

export default async function SuccessPage({ searchParams }: PageProps) {
  const { package: packageSlug } = await searchParams;
  const pkg = packageSlug ? getPackage(packageSlug) : undefined;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: PAPER, fontFamily: BODY_FONT, color: INK }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
      <PayHeader />
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div
          className="w-full max-w-lg rounded-md p-6 md:p-8 text-center"
          style={{ border: "1px solid rgba(42,42,34,0.15)", backgroundColor: PAPER }}
        >
          <span
            className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: GREEN }}
          >
            <Check size={28} className="text-white" strokeWidth={3} />
          </span>
          <h1
            className="uppercase font-medium leading-[1.15] mb-3 text-[1.65rem] text-balance"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em" }}
          >
            Payment Confirmed
          </h1>
          <p className="text-[16px] leading-relaxed text-pretty" style={{ color: "rgba(42,42,34,0.75)" }}>
            {pkg?.successMessage ||
              "Thank you. Your payment has gone through, and our team will be in touch shortly to arrange next steps."}
          </p>
          <p className="mt-8 text-xs" style={{ color: "rgba(42,42,34,0.55)" }}>
            Your Local Garden Designer · an independent design &amp; matching service ·
            yourlocalgardendesigner.co.uk
          </p>
        </div>
      </div>
    </div>
  );
}
