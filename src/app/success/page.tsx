import { getPackage } from "@/config/packages";

interface PageProps {
  searchParams: { package?: string; session_id?: string };
}

export const metadata = {
  title: "Payment Confirmed — Your Local Garden Designer",
};

export default function SuccessPage({ searchParams }: PageProps) {
  const pkg = searchParams.package ? getPackage(searchParams.package) : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-sage px-6 font-body text-forest">
      <div className="w-full max-w-lg rounded-2xl border border-gold-border bg-white p-8 text-center shadow-sm sm:p-10">
        <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-light text-3xl text-forest">
          ✓
        </span>
        <h1 className="mb-3 font-display text-2xl font-bold text-forest sm:text-3xl">
          Payment Confirmed
        </h1>
        <p className="mb-1 text-sm text-forest/80">
          Thank you{pkg ? ` for booking ${pkg.name}` : ""} — your payment has gone through.
        </p>
        <p className="text-sm text-forest/80">
          {pkg?.turnaround || "We'll be in touch shortly to get you booked in."}
        </p>
        <p className="mt-8 text-xs text-forest/60">
          Your Local Garden Designer · an independent design &amp; matching service ·
          yourlocalgardendesigner.co.uk
        </p>
      </div>
    </main>
  );
}
