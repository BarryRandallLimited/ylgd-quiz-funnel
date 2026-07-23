import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPackage, PACKAGE_ORDER } from "@/config/packages";
import PayClient from "./PayClient";

interface PageProps {
  params: { slug: string };
  searchParams: { ref?: string };
}

export function generateStaticParams() {
  return PACKAGE_ORDER.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const pkg = getPackage(params.slug);
  if (!pkg) return {};
  return {
    title: `${pkg.name} — Your Local Garden Designer`,
    description: pkg.tagline,
  };
}

export default function PayPage({ params, searchParams }: PageProps) {
  const pkg = getPackage(params.slug);
  if (!pkg) notFound();

  return <PayClient pkg={pkg} landscaperRef={searchParams.ref} />;
}
