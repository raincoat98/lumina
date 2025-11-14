import { useEffect, useCallback, useMemo } from "react";
import {
  useProductStore,
  Product as StoreProduct,
} from "@/stores/useProductStore";
import { useLoading } from "./useLoading";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
  description?: string;
}

// StoreProduct를 Product로 변환하는 함수
const convertStoreProductToProduct = (storeProduct: StoreProduct): Product => {
  // salePrice가 있으면 할인가, 없으면 price를 할인가로 사용 (호환성)
  // 주의: StoreProduct의 price는 원가, salePrice는 할인가
  const salePrice = storeProduct.salePrice || storeProduct.price;
  const originalPrice = storeProduct.originalPrice || storeProduct.price;

  const discount =
    salePrice < originalPrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : undefined;

  const convertedProduct = {
    id: storeProduct.id,
    name: storeProduct.name,
    price: salePrice, // 할인가를 price로 표시 (기존 인터페이스 호환)
    originalPrice: salePrice < originalPrice ? originalPrice : undefined,
    image: storeProduct.images[0] || "", // 첫 번째 이미지를 메인 이미지로 사용
    category: storeProduct.category,
    rating: storeProduct.rating,
    reviewCount: storeProduct.reviewCount,
    isNew: storeProduct.isNew,
    isSale:
      !!storeProduct.isSale ||
      !!storeProduct.salePrice ||
      !!(
        storeProduct.originalPrice &&
        storeProduct.originalPrice > storeProduct.price
      ),
    discount,
    description: storeProduct.description,
  };

  return convertedProduct;
};

export function useProducts() {
  const {
    loading,
    error,
    data: products,
    execute,
    setData,
  } = useLoading({
    delay: 300,
    onError: (error) => console.error("Failed to load products:", error),
  });

  // useProductStore에서 상품 데이터 가져오기
  const storeProducts = useProductStore((state) => state.products);

  // storeProducts를 즉시 변환하여 products로 설정
  const convertedProducts = useMemo(() => {
    console.log("useProducts useMemo - storeProducts:", {
      length: storeProducts.length,
      products: storeProducts.map((p) => ({
        id: p.id,
        name: p.name,
        isActive: p.isActive,
      })),
    });

    if (!storeProducts || storeProducts.length === 0) {
      console.log("storeProducts가 비어있음");
      return [];
    }

    const activeProducts = storeProducts.filter((product) => product.isActive);
    console.log("활성화된 상품:", activeProducts.length);

    const converted = activeProducts.map(convertStoreProductToProduct);
    console.log(
      "변환된 상품:",
      converted.length,
      converted.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice,
        isSale: p.isSale,
      }))
    );

    return converted;
  }, [storeProducts]);

  // 변환된 상품을 products에 설정
  useEffect(() => {
    console.log(
      "useProducts useEffect - convertedProducts 업데이트:",
      convertedProducts.length
    );
    setData(convertedProducts);
  }, [convertedProducts, setData]);

  // 상품 데이터 로드 (필요시 사용)
  const loadProducts = useCallback(async () => {
    return await execute(async () => {
      console.log("useProducts - storeProducts:", storeProducts);

      // useProductStore의 활성화된 상품들만 필터링 후 Product 형식으로 변환
      const activeProducts = storeProducts.filter(
        (product) => product.isActive
      );
      const convertedProducts = activeProducts.map(
        convertStoreProductToProduct
      );

      console.log("useProducts - convertedProducts:", convertedProducts);

      // 로딩 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 100));

      return convertedProducts;
    });
  }, [storeProducts, execute]);

  // 카테고리별 상품 필터링
  const getProductsByCategory = useCallback(
    (category: string) => {
      const productList = convertedProducts || [];
      if (!Array.isArray(productList) || productList.length === 0) {
        return [];
      }

      // 한글 카테고리명을 영문 카테고리명으로 매핑
      const categoryMapping: { [key: string]: string } = {
        상의: "top",
        하의: "bottom",
        원피스: "dress",
        아우터: "outer",
      };

      const mappedCategory = categoryMapping[category] || category;

      const categoryProducts = productList.filter(
        (product) => product.category === mappedCategory
      );
      console.log(
        `${category}(${mappedCategory}) 카테고리 필터링 결과:`,
        categoryProducts.length,
        categoryProducts.map((p) => ({ id: p.id, name: p.name }))
      );
      return categoryProducts;
    },
    [convertedProducts]
  );

  // 신상품 필터링
  const getNewProducts = useCallback(() => {
    const productList = convertedProducts || [];
    if (!Array.isArray(productList) || productList.length === 0) {
      return [];
    }
    const newProducts = productList.filter((product) => product.isNew);
    console.log(
      "신상품 필터링 결과:",
      newProducts.length,
      newProducts.map((p) => ({ id: p.id, name: p.name }))
    );
    return newProducts;
  }, [convertedProducts]);

  // 할인 상품 필터링
  const getSaleProducts = useCallback(() => {
    const productList = convertedProducts || [];
    if (!Array.isArray(productList) || productList.length === 0) {
      console.log("할인 상품 필터링: convertedProducts가 없음", {
        convertedProducts,
        type: typeof convertedProducts,
      });
      return [];
    }
    // 변환된 Product는 이미 price가 할인가이고, originalPrice가 있으면 할인 상품
    const saleProducts = productList.filter(
      (product) =>
        product.isSale ||
        (product.originalPrice && product.originalPrice > product.price)
    );
    console.log("할인 상품 필터링 결과:", {
      totalProducts: productList.length,
      saleProducts: saleProducts.length,
      products: saleProducts.map((p) => ({
        id: p.id,
        name: p.name,
        isSale: p.isSale,
        originalPrice: p.originalPrice,
        price: p.price,
      })),
    });
    return saleProducts;
  }, [convertedProducts]);

  // 인기 상품 필터링 (평점 기준)
  const getPopularProducts = useCallback(
    (limit: number = 8) => {
      const productList = convertedProducts || [];
      if (!Array.isArray(productList) || productList.length === 0) {
        return [];
      }
      return productList.sort((a, b) => b.rating - a.rating).slice(0, limit);
    },
    [convertedProducts]
  );

  // 이미지 URL 검증
  const isValidImageUrl = (url: string): boolean => {
    if (!url || url.trim() === "") return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 상품 검색
  const searchProducts = useCallback(
    (query: string) => {
      const productList = convertedProducts || [];
      if (!Array.isArray(productList) || productList.length === 0) {
        return [];
      }
      const lowercaseQuery = query.toLowerCase();
      return productList.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercaseQuery) ||
          product.category.toLowerCase().includes(lowercaseQuery) ||
          product.description?.toLowerCase().includes(lowercaseQuery)
      );
    },
    [convertedProducts]
  );

  const productList = convertedProducts || [];

  return {
    products: Array.isArray(productList) ? productList : [],
    loading,
    error,
    getProductsByCategory,
    getNewProducts,
    getSaleProducts,
    getPopularProducts,
    searchProducts,
    reloadProducts: loadProducts,
    // 안전한 getter 함수들
    getProductsSafely: () => (Array.isArray(productList) ? productList : []),
    hasProducts: () => Array.isArray(productList) && productList.length > 0,
  };
}
