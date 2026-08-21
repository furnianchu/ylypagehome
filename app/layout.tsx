import type { Metadata } from "next";
import BackgroundWrapper from "@/components/BackgroundWrapper";

export const metadata: Metadata = {
  title: '月月子代代雪の草窝',
  description: '个人专属空间',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <BackgroundWrapper>{children}</BackgroundWrapper>
      </body>
    </html>
  );
}
