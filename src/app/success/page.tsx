import { Check } from "lucide-react";
import { getPackage } from "@/config/packages";
import PayHeader from "@/components/PayHeader";

interface PageProps {
  searchParams: Promise<{ package?: string; session_id?: string }>;
}

export const metadata = {
  title: "Payment Confirmed — Your Local Garden Designer",
};

export default async function SuccessPage({ searchParams }: PageProps) {
  const { package: packageSlug } = await searchParams;
  const pkg = packageSlug ? getPackage(packageSlug) : undefined;

  return (
    <div className="min-h-screen flex flex-col font-body" style={{ backgroundColor: "#F5F5F0" }}>
      <PayHeader />
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-sm border border-stone-100 p-6 md:p-8 text-center">
          <span
            className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: "#C9A76A" }}
          >
            <Check size={28} className="text-white" strokeWidth={3} />
          </span>
          <h1 className="text-[1.65rem] leading-[1.08] font-bold text-stone-950 mb-3 text-balance font-display">
            Payment Confirmed
          </h1>
          <p className="text-[16px] text-stone-600 leading-relaxed text-pretty">
            {pkg?.successMessage ||
              "Thank you — your payment has gone through. Our team will be in touch shortly to arrange next steps."}
          </p>
          <p className="mt-8 text-xs text-stone-400">
            Your Local Garden Designer · an independent design &amp; matching service ·
            yourlocalgardendesigner.co.uk
          </p>
        </div>
      </div>
    </div>
  );
}
