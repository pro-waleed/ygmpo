import { officialSnapshots } from "@ygmpo/shared/demo-data";
import { OfficialProfileClient } from "../../../components/runtime/official-profile-client";

export function generateStaticParams() {
  return officialSnapshots.map((item) => ({ id: item.id }));
}

export default async function OfficialProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OfficialProfileClient id={id} />;
}