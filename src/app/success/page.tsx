import { getPackage } from "@/config/packages";

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
    <main className="flex min-h-screen items-center justify-center bg-sage px-6 font-body text-forest">
      <div className="w-full max-w-lg rounded-2xl border border-gold-border bg-white p-8 text-center shadow-sm sm:p-10">
        <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-light text-3xl text-forest">
          ✓
        </span>
        <h1 className="mb-3 font-display text-2xl font-bold text-forest sm:text-3xl">
          Payment Confirmed
        </h1>
        <p className="text-sm text-forest/80">
          {pkg?.successMessage ||
            "Thank you — your payment has gone through. Our team will be in touch shortly to arrange next steps."}
        </p>
        <p className="mt-8 text-xs text-forest/60">
          Your Local Garden Designer · an independent design &amp; matching service ·
          yourlocalgardendesigner.co.uk
        </p>
      </div>
    </main>
  );
}
