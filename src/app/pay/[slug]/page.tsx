import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPackage, PACKAGE_ORDER } from "@/config/packages";
import PayClient from "./PayClient";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string; test?: string }>;
}

export function generateStaticParams() {
  return PACKAGE_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return {};
  return {
    title: `${pkg.name} — Your Local Garden Designer`,
    description: pkg.tagline,
  };
}

export default async function PayPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { ref, test } = await searchParams;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  return <PayClient pkg={pkg} landscaperRef={ref} testCode={test} />;
}
