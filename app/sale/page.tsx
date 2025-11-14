"use client";

import React from "react";
import { useProductStore } from "@/stores/useProductStore";
import ProductGrid from "@/components/product/ProductGrid";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SalePage() {
  const { products } = useProductStore();

  // 세일 상품만 필터링하고 ProductGrid에 맞는 형태로 변환
  const saleProducts = products
    .filter(
      (product) =>
        product.isSale ||
        product.salePrice ||
        (product.originalPrice && product.originalPrice > product.price)
    )
    .map((product) => {
      // salePrice가 있으면 할인가로 사용, 없으면 price를 할인가로 사용
      const salePrice = product.salePrice || product.price;
      const originalPrice = product.originalPrice || product.price;

      return {
        ...product,
        price: salePrice, // 할인가를 price로 설정
        salePrice: product.salePrice,
        originalPrice: salePrice < originalPrice ? originalPrice : undefined,
        images: product.images || ["/images/placeholder.jpg"],
        isSale: true,
        inStock: true,
      };
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            🎉 할인 상품
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            특별한 가격으로 만나는 인기 상품들
          </p>
        </div>

        {/* 세일 배너 */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">최대 50%</div>
              <div className="text-sm">할인</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">무료배송</div>
              <div className="text-sm">5만원 이상</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">7일</div>
              <div className="text-sm">교환/반품</div>
            </div>
          </div>
        </div>

        <ProductGrid
          products={saleProducts}
          showSearchBar={true}
          defaultViewMode="grid"
          saleTheme={true}
        />

        {/* 세일 안내 */}
        <div className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            세일 안내
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                할인 혜택
              </h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>• 최대 50% 할인 적용</li>
                <li>• 중복 할인 불가</li>
                <li>• 쿠폰 사용 가능</li>
                <li>• 추가 멤버십 혜택</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                배송 안내
              </h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>• 5만원 이상 구매 시 무료배송</li>
                <li>• 1-2일 내 배송 시작</li>
                <li>• 교환/반품 7일 이내 가능</li>
                <li>• 전국 어디든 배송</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
