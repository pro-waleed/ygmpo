import Link from "next/link";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/dashboard", label: "لوحة المؤشرات" },
  { href: "/ministries", label: "الوزارات" },
  { href: "/officials", label: "الوزراء" },
  { href: "/reports", label: "التقارير" },
  { href: "/methodology", label: "المنهجية" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-sand/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div>
          <p className="text-xs text-teal">YGMPO</p>
          <h1 className="text-lg font-bold">منصة مرصد الأداء الحكومي والقيادي - اليمن</h1>
        </div>
        <nav className="hidden gap-2 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm text-ink transition hover:bg-white hover:shadow-soft">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
