import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./styles.css";
import { Providers } from "./providers";

const mulish = Mulish({
  subsets: ["cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DetailBot — поиск автозапчастей",
  description: "Найдём нужную деталь среди сотен предложений",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${mulish.className} bg-gray-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
