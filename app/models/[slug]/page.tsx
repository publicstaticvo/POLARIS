import { ModelProfileClient } from "@/components/model-profile-client";

export default function ModelDetailPage({ params }: { params: { slug: string } }) {
  return <ModelProfileClient slug={params.slug} />;
}
