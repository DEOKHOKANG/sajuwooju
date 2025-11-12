import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "사주우주 어드민 - Admin Dashboard",
  description: "사주우주 관리자 대시보드",
};

export default function AdminLayout({
  children,
}: {
  children: React.Node;
}) {
  return (
    <html lang="ko" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
