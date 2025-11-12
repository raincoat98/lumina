import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductTabs from "@/components/product/ProductTabs";
import ProductDetailWrapper from "./ProductDetailWrapper";
import { getProductById, getAllProducts, getSiteUrl } from "@/lib/products";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

// Static generation for export - 모든 활성 상품 ID 생성
export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

// Generate metadata for each product
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = getProductById(params.id);
  const siteUrl = getSiteUrl();

  if (!product) {
    return {
      title: "상품을 찾을 수 없습니다 - LUMINA",
      description: "요청하신 상품이 존재하지 않거나 삭제되었습니다.",
    };
  }

  const productUrl = `${siteUrl}/products/${product.id}`;
  const productImage = product.images[0] || `${siteUrl}/og-default.jpg`;
  const price = product.originalPrice || product.price;
  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return {
    title: `${product.name} - LUMINA`,
    description: product.description,
    keywords: [
      product.name,
      product.category,
      product.subCategory,
      ...product.tags,
      "LUMINA",
      "패션",
      "의류",
    ].join(", "),
    openGraph: {
      title: product.name,
      description: product.description,
      type: "product",
      url: productUrl,
      siteName: "LUMINA",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
        ...product.images.slice(1, 4).map((img) => ({
          url: img,
          width: 800,
          height: 800,
          alt: product.name,
        })),
      ],
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
    },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "KRW",
      "product:availability": product.stock > 0 ? "in stock" : "out of stock",
      "product:condition": "new",
      "product:retailer": "LUMINA",
      ...(discountPercent > 0 && {
        "product:discount": discountPercent.toString(),
      }),
    },
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = getProductById(params.id);
  const siteUrl = getSiteUrl();

  // 브레드크럼 데이터
  const breadcrumbs = [
    { name: "홈", url: siteUrl },
    { name: "상품", url: `${siteUrl}/products` },
    ...(product
      ? [
          {
            name: product.category === "top" ? "상의" : product.category === "bottom" ? "하의" : product.category === "dress" ? "원피스" : product.category === "outer" ? "아우터" : product.category,
            url: `${siteUrl}/categories/${product.category}`,
          },
          { name: product.name, url: `${siteUrl}/products/${product.id}` },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* JSON-LD 구조화 데이터 */}
      {product && (
        <>
          <ProductJsonLd
            product={{
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              originalPrice: product.originalPrice,
              images: product.images,
              category: product.category,
              subCategory: product.subCategory,
              rating: product.rating,
              reviewCount: product.reviewCount,
              stock: product.stock,
              brand: "LUMINA",
            }}
          />
          <BreadcrumbJsonLd items={breadcrumbs} />
        </>
      )}

      <Header />

      <main
        className="container mx-auto py-3 sm:py-4 lg:py-6 px-3 sm:px-4 lg:px-0"
        id="product-main"
      >
        {/* 페이지 로딩 애니메이션을 위한 wrapper */}
        <div className="product-page-wrapper bg-white dark:bg-gray-900">
          <ProductDetailWrapper productId={params.id} />
        </div>
      </main>

      {/* Mobile bottom padding for sticky actions */}
      <div className="lg:hidden h-16 sm:h-20"></div>

      <Footer />
    </div>
  );
}
