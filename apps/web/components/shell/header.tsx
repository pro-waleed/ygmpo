import Link from "next/link";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/dashboard", label: "لوحة المؤشرات" },
  { href: "/admin", label: "إدارة المنصة" },
  { href: "/ministries", label: "الوزارات" },
  { href: "/officials", label: "الوزراء" },
  { href: "/reports", label: "التقارير" },
  { href: "/methodology", label: "المنهجية" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-sand/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white shadow-soft">YG</div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-teal">YGMPO</p>
            <h1 className="text-lg font-bold">منصة مرصد الأداء الحكومي والقيادي - اليمن</h1>
          </div>
        </div>
        <nav className="hidden flex-wrap gap-2 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-transparent px-4 py-2 text-sm text-ink transition hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/75 hover:shadow-soft">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}