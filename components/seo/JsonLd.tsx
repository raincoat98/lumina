import React from "react";

interface JsonLdProps {
  data: Record<string, any>;
}

/**
 * JSON-LD 구조화 데이터를 렌더링하는 컴포넌트
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * 조직(Organization) JSON-LD 생성
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LUMINA",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://lumina-ecommerce.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://lumina-ecommerce.com"}/logo.png`,
    description:
      "LUMINA는 당신의 개성과 아름다움을 빛나게 하는 프리미엄 의류 브랜드입니다.",
    sameAs: [
      // 소셜 미디어 링크가 있다면 추가
      // "https://www.facebook.com/lumina",
      // "https://www.instagram.com/lumina",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Korean"],
    },
  };

  return <JsonLd data={data} />;
}

/**
 * 웹사이트(WebSite) JSON-LD 생성
 */
export function WebSiteJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lumina-ecommerce.com";
  
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LUMINA",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

/**
 * 상품(Product) JSON-LD 생성
 */
interface ProductJsonLdProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
    subCategory?: string;
    rating: number;
    reviewCount: number;
    stock: number;
    brand?: string;
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lumina-ecommerce.com";
  const productUrl = `${siteUrl}/products/${product.id}`;
  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: product.brand || "LUMINA",
    },
    category: product.subCategory || product.category,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "KRW",
      price: product.price,
      priceValidUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      ...(product.originalPrice && {
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: product.originalPrice,
          priceCurrency: "KRW",
        },
      }),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    ...(discountPercent > 0 && {
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "할인율",
          value: `${discountPercent}%`,
        },
      ],
    }),
  };

  return <JsonLd data={data} />;
}

/**
 * 브레드크럼(BreadcrumbList) JSON-LD 생성
 */
interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

/**
 * 컬렉션(CollectionPage) JSON-LD 생성
 */
interface CollectionPageJsonLdProps {
  name: string;
  description: string;
  url: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    images: string[];
  }>;
}

export function CollectionPageJsonLd({
  name,
  description,
  url,
  products,
}: CollectionPageJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lumina-ecommerce.com";

  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          image: product.images[0],
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "KRW",
          },
          url: `${siteUrl}/products/${product.id}`,
        },
      })),
    },
  };

  return <JsonLd data={data} />;
}

