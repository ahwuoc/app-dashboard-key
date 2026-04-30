import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "FB Bot Pro | Hệ Thống Quản Lý Bản Quyền",
  description: "Trang quản lý và xác thực key bản quyền cho phần mềm FB Bot Pro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={outfit.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
