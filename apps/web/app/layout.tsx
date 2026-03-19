import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Header } from "../components/shell/header";
import { Footer } from "../components/shell/footer";

const noto = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "700", "800"] });

export const metadata: Metadata = {
  title: "مرصد الأداء الحكومي والقيادي - اليمن",
  description: "منصة عربية لرصد وتقييم أداء الوزارات والقيادات الحكومية في اليمن وفق منهجية قائمة على الأدلة."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={noto.className}>
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
