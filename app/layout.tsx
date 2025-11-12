import "./globals.css";
import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import TopButton from "@/components/ui/top-button";
import TopBanner from "@/components/layout/TopBanner";
import Popup from "@/components/layout/Popup";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

const inter = Inter({ subsets: ["latin"] });
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://lumina-ecommerce.com"
  ),
  title: {
    default: "LUMINA - 빛나는 당신을 위한 스타일",
    template: "%s | LUMINA",
  },
  description:
    "LUMINA는 당신의 개성과 아름다움을 빛나게 하는 프리미엄 의류 브랜드입니다. 세련된 디자인과 최고급 소재로 완성된 스타일을 만나보세요.",
  keywords: [
    "LUMINA",
    "패션",
    "의류",
    "여성의류",
    "온라인쇼핑",
    "패션브랜드",
    "스타일",
    "의상",
  ],
  authors: [{ name: "LUMINA" }],
  creator: "LUMINA",
  publisher: "LUMINA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://lumina-ecommerce.com",
    siteName: "LUMINA",
    title: "LUMINA - 빛나는 당신을 위한 스타일",
    description:
      "LUMINA는 당신의 개성과 아름다움을 빛나게 하는 프리미엄 의류 브랜드입니다.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LUMINA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMINA - 빛나는 당신을 위한 스타일",
    description:
      "LUMINA는 당신의 개성과 아름다움을 빛나게 하는 프리미엄 의류 브랜드입니다.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console 등에서 사용할 수 있는 검증 코드
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${inter.className} ${notoSansKR.variable} font-sans relative`}
        suppressHydrationWarning={true}
      >
        {/* JSON-LD 구조화 데이터 */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <TopBanner />
            <main className="pt-0">{children}</main>
            <Popup />
            <TopButton />
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
