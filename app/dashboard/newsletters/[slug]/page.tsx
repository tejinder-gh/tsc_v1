import { notFound } from "next/navigation";
import { getNewsletterBySlug } from "@/features/newsletters/data/newsletters";
import { NewsletterManageClient } from "./newsletter-manage-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata = {
  title: "Manage Publication | TheSkillCorner Workspace",
};

export default async function ManageNewsletterPage({ params }: Props) {
  const { slug } = await params;
  const newsletter = getNewsletterBySlug(slug);

  if (!newsletter) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <NewsletterManageClient newsletter={newsletter} />
    </div>
  );
}
