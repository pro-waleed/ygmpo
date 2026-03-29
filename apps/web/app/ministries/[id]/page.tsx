import { ministrySnapshots } from "@ygmpo/shared/demo-data";
import { MinistryProfileClient } from "../../../components/runtime/ministry-profile-client";

export function generateStaticParams() {
  return ministrySnapshots.map((item) => ({ id: item.id }));
}

export default async function MinistryProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MinistryProfileClient id={id} />;
}