import { officialSnapshots } from "@ygmpo/shared/demo-data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return officialSnapshots.map((item) => ({ id: item.id }));
}

export default async function OfficialProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const official = officialSnapshots.find((item) => item.id === id);
  if (!official) notFound();

  return (
    <div className="space-y-6">
      <section className="card p-8">
        <span className="metric-pill">ملف وزير</span>
        <h1 className="mt-4 text-3xl font-extrabold">{official.name}</h1>
        <p className="mt-2 text-lg text-ink/70">{official.ministryName}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-mist/60 p-4"><p className="text-sm text-ink/60">الدرجة الكلية</p><p className="mt-2 text-2xl font-bold text-teal">{official.score}%</p></div>
          <div className="rounded-2xl bg-mist/60 p-4"><p className="text-sm text-ink/60">اتساق الموقف الرسمي</p><p className="mt-2 text-2xl font-bold">{official.alignmentRate}%</p></div>
          <div className="rounded-2xl bg-mist/60 p-4"><p className="text-sm text-ink/60">التواجد داخل اليمن</p><p className="mt-2 text-2xl font-bold">{official.presenceRate}%</p></div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="card p-6">
          <h2 className="text-xl font-bold">التصريحات والتفاعل الرسمي</h2>
          <p className="mt-4 leading-8 text-ink/75">توثق المنصة التصريحات الرسمية والإعلامية بحسب الموضوع والمصدر، ثم تسمح للمراجع بتقييم اتساقها مع السياسة العامة للدولة وربطها بأدلة موثقة.</p>
        </article>
        <article className="card p-6">
          <h2 className="text-xl font-bold">المواقف الوطنية</h2>
          <p className="mt-4 leading-8 text-ink/75">يعتمد هذا المحور على تعريف القضية الوطنية، وتلخيص الموقف الرسمي للدولة، ثم رصد ما إذا كان الوزير قد دعم هذا الموقف، خالفه، أو بقي وضعه غير واضح، مع إلزام الدليل والمراجعة البشرية.</p>
        </article>
      </section>
    </div>
  );
}