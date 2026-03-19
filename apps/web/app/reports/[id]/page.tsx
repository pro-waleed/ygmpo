import { reportSummaries } from "@ygmpo/shared/demo-data";

export function generateStaticParams() {
  return reportSummaries.map((item) => ({ id: item.id }));
}

export default async function ReportDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = reportSummaries.find((item) => item.id === id) ?? reportSummaries[0];

  return (
    <article className="card p-10 print:shadow-none">
      <span className="metric-pill">نسخة قابلة للطباعة</span>
      <h1 className="mt-5 text-4xl font-extrabold">{report.title}</h1>
      <p className="mt-3 text-sm text-ink/60">نشر في {report.publishedAt}</p>
      <section className="mt-8 space-y-6 leading-8 text-ink/80">
        <p>{report.summary}</p>
        <p>يعرض هذا التقرير خلاصة درجات الأداء، أهم التغيرات، المؤشرات التي خضعت لمراجعة، وتحليل الحضور والتواجد والتفاعل الرسمي خلال الفترة التقييمية.</p>
        <p>تم تصميم الصفحة بطابع نظيف ومؤسسي لتكون مناسبة للتحويل إلى PDF أو العرض أمام أصحاب المصلحة.</p>
      </section>
    </article>
  );
}