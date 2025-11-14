"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Filter, Heart, Star, ShoppingBag, Eye, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useProductStore } from "@/stores/useProductStore";
import ProductFilter, { FilterOptions } from "./ProductFilter";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors?: string[];
  tags?: string[];
  isNew?: boolean;
  isSale?: boolean;
  isBest?: boolean;
  inStock?: boolean;
  description?: string;
}

interface ProductGridProps {
  products: Product[];
  showSearchBar?: boolean;
  itemsPerPage?: number;
  className?: string;
  saleTheme?: boolean; // 할인 페이지 테마
  defaultCategory?: string; // 기본 카테고리
  defaultViewMode?: "grid" | "list"; // 기본 뷰 모드
  specialFilter?: { isNew?: boolean; isBest?: boolean; onSale?: boolean }; // 특별 필터
}

export default function ProductGrid({
  products = [],
  showSearchBar = true,
  itemsPerPage = 20,
  className,
  saleTheme = false,
  defaultCategory,
  defaultViewMode = "grid",
  specialFilter,
}: ProductGridProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const { toast } = useToast();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlistByProductId, isInWishlist } =
    useProductStore();

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 필터 상태 읽기
  const getInitialFilters = useCallback((): FilterOptions => {
    let categories =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const sizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
    const colors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
    const priceMin = parseInt(searchParams.get("priceMin") || "0");
    const priceMax = parseInt(searchParams.get("priceMax") || "1000000");
    const ratings =
      searchParams.get("ratings")?.split(",").map(Number).filter(Boolean) || [];
    const sortBy = searchParams.get("sortBy") || "popular";
    const inStock = searchParams.get("inStock") === "true";
    const onSale =
      searchParams.get("onSale") === "true" ||
      saleTheme ||
      !!specialFilter?.onSale;
    const isNew =
      searchParams.get("isNew") === "true" || !!specialFilter?.isNew;
    const isBest =
      searchParams.get("isBest") === "true" || !!specialFilter?.isBest;

    // 기본 카테고리가 설정되어 있고 URL에 카테고리가 없을 때만 기본 카테고리 설정
    // 단, 특별 필터(신상품, 베스트, 세일)가 있을 때는 카테고리 필터를 설정하지 않음
    if (defaultCategory && categories.length === 0 && !specialFilter) {
      categories = [defaultCategory];
    }

    return {
      categories,
      brands,
      sizes,
      colors,
      priceRange: [priceMin, priceMax],
      ratings,
      tags: [],
      sortBy,
      inStock,
      onSale,
      isNew,
      isBest,
    };
  }, [searchParams, defaultCategory, saleTheme]);

  // 필터 초기 상태
  const [filters, setFilters] = useState<FilterOptions>(getInitialFilters);

  // URL 파라미터나 defaultCategory가 변경되면 필터 상태 업데이트
  useEffect(() => {
    const newFilters = getInitialFilters();
    setFilters(newFilters);

    // defaultCategory가 변경되었고 URL에 카테고리가 없을 때만 URL 업데이트
    // 단, 특별 필터(신상품, 베스트, 세일)가 있을 때는 카테고리 필터를 설정하지 않음
    if (defaultCategory && !specialFilter) {
      const currentCategories =
        searchParams.get("categories")?.split(",").filter(Boolean) || [];
      if (currentCategories.length === 0) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("categories", defaultCategory);
        const newURL = `${window.location.pathname}?${params.toString()}`;
        router.replace(newURL, { scroll: false });
      }
    }

    // 특별 필터가 있을 때 URL에 해당 필터 파라미터 추가
    if (specialFilter) {
      const params = new URLSearchParams(searchParams.toString());
      let hasChanges = false;

      if (specialFilter.isNew && !searchParams.get("isNew")) {
        params.set("isNew", "true");
        hasChanges = true;
      }
      if (specialFilter.isBest && !searchParams.get("isBest")) {
        params.set("isBest", "true");
        hasChanges = true;
      }
      if (specialFilter.onSale && !searchParams.get("onSale")) {
        params.set("onSale", "true");
        hasChanges = true;
      }

      if (hasChanges) {
        const newURL = `${window.location.pathname}?${params.toString()}`;
        router.replace(newURL, { scroll: false });
      }
    }
  }, [getInitialFilters, defaultCategory, searchParams, router, specialFilter]);

  // 필터 변경 시 URL 업데이트
  const updateFiltersAndURL = (newFilters: FilterOptions) => {
    // 필터링 상태 시작
    setIsFiltering(true);

    // 필터 상태 즉시 업데이트
    setFilters(newFilters);

    // 현재 페이지를 1페이지로 리셋
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());

    // 카테고리
    if (newFilters.categories.length > 0) {
      params.set("categories", newFilters.categories.join(","));
    } else {
      params.delete("categories");
    }

    // 브랜드
    if (newFilters.brands.length > 0) {
      params.set("brands", newFilters.brands.join(","));
    } else {
      params.delete("brands");
    }

    // 사이즈
    if (newFilters.sizes.length > 0) {
      params.set("sizes", newFilters.sizes.join(","));
    } else {
      params.delete("sizes");
    }

    // 색상
    if (newFilters.colors.length > 0) {
      params.set("colors", newFilters.colors.join(","));
    } else {
      params.delete("colors");
    }

    // 가격 범위
    if (newFilters.priceRange[0] > 0) {
      params.set("priceMin", newFilters.priceRange[0].toString());
    } else {
      params.delete("priceMin");
    }

    if (newFilters.priceRange[1] < 1000000) {
      params.set("priceMax", newFilters.priceRange[1].toString());
    } else {
      params.delete("priceMax");
    }

    // 평점
    if (newFilters.ratings.length > 0) {
      params.set("ratings", newFilters.ratings.join(","));
    } else {
      params.delete("ratings");
    }

    // 정렬
    if (newFilters.sortBy !== "popular") {
      params.set("sortBy", newFilters.sortBy);
    } else {
      params.delete("sortBy");
    }

    // 기타 옵션
    if (newFilters.inStock) {
      params.set("inStock", "true");
    } else {
      params.delete("inStock");
    }

    if (newFilters.onSale) {
      params.set("onSale", "true");
    } else {
      params.delete("onSale");
    }

    if (newFilters.isNew) {
      params.set("isNew", "true");
    } else {
      params.delete("isNew");
    }

    if (newFilters.isBest) {
      params.set("isBest", "true");
    } else {
      params.delete("isBest");
    }

    // 페이지 리셋
    params.delete("page");

    // URL 업데이트 (replace 사용하여 히스토리 추가하지 않음)
    const newURL = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.replace(newURL, { scroll: false });

    // 필터링 완료 후 상태 리셋
    setTimeout(() => {
      setIsFiltering(false);
    }, 100);
  };

  // 검색어 변경 시 URL 업데이트
  const updateSearchAndURL = (newSearchTerm: string) => {
    // 필터링 상태 시작
    setIsFiltering(true);

    // 검색어 즉시 업데이트
    setSearchTerm(newSearchTerm);

    // 현재 페이지를 1페이지로 리셋
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());

    if (newSearchTerm.trim()) {
      params.set("q", newSearchTerm);
    } else {
      params.delete("q");
    }

    // 페이지 리셋
    params.delete("page");

    const newURL = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.replace(newURL, { scroll: false });

    // 필터링 완료 후 상태 리셋
    setTimeout(() => {
      setIsFiltering(false);
    }, 100);
  };

  // URL에서 검색어 읽기
  useEffect(() => {
    const urlSearchTerm = searchParams.get("q") || "";
    setSearchTerm(urlSearchTerm);
  }, [searchParams]);

  // 모바일 감지
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // 필터링된 상품
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 검색어 필터링
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search) ||
          product.brand?.toLowerCase().includes(search) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    // 카테고리 필터링
    if (filters.categories.length > 0) {
      // 카테고리 매핑 (한글 -> 영어)
      const categoryMapping: { [key: string]: string } = {
        상의: "top",
        하의: "bottom",
        아우터: "outer",
        드레스: "dress",
        신발: "shoes",
        가방: "bag",
        액세서리: "accessory",
        언더웨어: "underwear",
      };

      const mappedCategories = filters.categories.map(
        (cat) => categoryMapping[cat] || cat
      );

      result = result.filter((product) =>
        mappedCategories.includes(product.category)
      );
    }

    // 브랜드 필터링
    if (filters.brands.length > 0) {
      result = result.filter(
        (product) => product.brand && filters.brands.includes(product.brand)
      );
    }

    // 가격 필터링
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // 사이즈 필터링
    if (filters.sizes.length > 0) {
      result = result.filter((product) =>
        filters.sizes.some((size) => product.sizes.includes(size))
      );
    }

    // 색상 필터링
    if (filters.colors.length > 0) {
      result = result.filter(
        (product) =>
          product.colors &&
          filters.colors.some((color) => product.colors!.includes(color))
      );
    }

    // 평점 필터링
    if (filters.ratings.length > 0) {
      result = result.filter((product) =>
        filters.ratings.some((rating) => product.rating >= rating)
      );
    }

    // 기타 옵션 필터링
    if (filters.inStock) {
      result = result.filter((product) => product.inStock !== false);
    }

    if (filters.onSale) {
      result = result.filter(
        (product) =>
          product.isSale ||
          product.salePrice ||
          (product.originalPrice && product.originalPrice > product.price)
      );
    }

    if (filters.isNew) {
      result = result.filter((product) => product.isNew);
    }

    if (filters.isBest) {
      result = result.filter((product) => product.isBest);
    }

    // 정렬
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case "rating":
          return b.rating - a.rating;
        case "review":
          return b.reviewCount - a.reviewCount;
        case "popular":
        default:
          return (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0);
      }
    });

    return result;
  }, [products, searchTerm, filters]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // URL에서 페이지 읽기
  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    if (urlPage !== currentPage && urlPage >= 1 && urlPage <= totalPages) {
      setCurrentPage(urlPage);
    }
  }, [searchParams, totalPages]);

  // 페이지 변경 시 URL 업데이트
  const updatePageAndURL = (newPage: number) => {
    // 페이지 즉시 업데이트
    setCurrentPage(newPage);

    const params = new URLSearchParams(searchParams.toString());

    if (newPage > 1) {
      params.set("page", newPage.toString());
    } else {
      params.delete("page");
    }

    const newURL = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.replace(newURL, { scroll: false });
  };

  // 페이지 변경 시 스크롤 to top
  useEffect(() => {
    if (currentPage > 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      size: product.sizes[0] || "M",
      color: product.colors?.[0] || "기본",
    });
  };

  const handleToggleWishlist = (product: Product) => {
    const isWishlisted = isInWishlist(product.id);

    if (isWishlisted) {
      removeFromWishlistByProductId(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        rating: product.rating,
        reviewCount: product.reviewCount,
        isNew: product.isNew || false,
        isSale: product.isSale || !!product.originalPrice,
        isBest: product.isBest || false,
      });
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* 검색바 */}
      {showSearchBar && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <Input
            placeholder="상품명, 브랜드, 카테고리로 검색..."
            value={searchTerm}
            onChange={(e) => updateSearchAndURL(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => updateSearchAndURL("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* 사이드바 필터 (데스크톱) */}
        {!isMobile && (
          <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-4">
              <ProductFilter
                isOpen={true}
                onOpenChange={() => {}}
                filters={filters}
                onFiltersChange={updateFiltersAndURL}
                isMobile={false}
                totalProducts={products.length}
                filteredCount={filteredProducts.length}
              />
            </div>
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <div className="flex-1 space-y-4 lg:space-y-6">
          {/* 툴바 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {/* 모바일 필터 버튼 */}
              {isMobile && (
                <ProductFilter
                  isOpen={showFilters}
                  onOpenChange={setShowFilters}
                  filters={filters}
                  onFiltersChange={updateFiltersAndURL}
                  isMobile={true}
                  totalProducts={products.length}
                  filteredCount={filteredProducts.length}
                />
              )}
            </div>

            {/* 결과 요약 */}
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              {isFiltering && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              )}
              총 {filteredProducts.length}개 상품
              {searchTerm && ` (검색: "${searchTerm}")`}
            </div>
          </div>

          {/* 상품 그리드 */}
          {paginatedProducts.length > 0 ? (
            <>
              <div
                className={cn(
                  "grid gap-4 md:gap-6",
                  // 반응형 그리드: 모바일에서 3개, 태블릿에서 4개, 데스크톱에서 5개
                  "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5"
                )}
              >
                {paginatedProducts.map((product) => (
                  <ProductGridItem
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isMobile={isMobile}
                    saleTheme={saleTheme}
                  />
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-6 sm:mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updatePageAndURL(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    이전
                  </Button>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + 1;
                    if (totalPages <= 5) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => updatePageAndURL(page)}
                          className="text-xs sm:text-sm px-2 sm:px-3 min-w-[32px] sm:min-w-[36px]"
                        >
                          {page}
                        </Button>
                      );
                    }
                    // 복잡한 페이지네이션 로직은 생략하고 간단히 구현
                    return null;
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updatePageAndURL(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    다음
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Search className="w-12 h-12 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                다른 검색어나 필터를 시도해보세요
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  updateFiltersAndURL({
                    categories: [],
                    brands: [],
                    sizes: [],
                    colors: [],
                    priceRange: [0, 1000000],
                    ratings: [],
                    tags: [],
                    sortBy: "popular",
                    inStock: false,
                    onSale: false,
                    isNew: false,
                    isBest: false,
                  });
                }}
              >
                필터 초기화
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 그리드 아이템 컴포넌트
function ProductGridItem({
  product,
  onAddToCart,
  onToggleWishlist,
  isMobile = false,
  saleTheme = false,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isMobile?: boolean;
  saleTheme?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist } = useProductStore();
  const isWishlisted = isInWishlist(product.id);

  // salePrice가 있으면 할인가로 사용, 없으면 price를 할인가로 사용
  const salePrice = product.salePrice || product.price;
  const originalPrice = product.originalPrice || product.price;

  const discountPercentage =
    salePrice < originalPrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0;

  return (
    <Card
      className="group hover:shadow-lg dark:hover:shadow-gray-800/50 transition-all duration-300 overflow-hidden h-full cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.images[0] || "/images/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* 배지들 */}
        <div className="absolute top-1 left-1 flex flex-col gap-0.5">
          {product.isNew && (
            <Badge
              className={cn(
                "bg-blue-500 text-white",
                isMobile ? "text-[10px] px-1 py-0.5" : "text-xs px-2 py-1"
              )}
            >
              NEW
            </Badge>
          )}
          {product.isBest && (
            <Badge
              className={cn(
                "bg-red-500 text-white",
                isMobile ? "text-[10px] px-1 py-0.5" : "text-xs px-2 py-1"
              )}
            >
              BEST
            </Badge>
          )}
        </div>

        {/* 위시리스트 버튼 */}
        <button
          onClick={() => onToggleWishlist(product)}
          className={cn(
            "absolute top-1 right-1 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all",
            isMobile ? "p-1" : "p-2"
          )}
        >
          <Heart
            className={cn(
              "transition-colors",
              isMobile ? "w-3 h-3" : "w-4 h-4",
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-400 dark:text-gray-300"
            )}
          />
        </button>

        {/* 호버 액션들 */}
        {!isMobile && (
          <div
            className={cn(
              "absolute bottom-2 left-2 right-2 flex gap-2 transition-all duration-300",
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            )}
          >
            <Button
              size="sm"
              className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => onAddToCart(product)}
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
            <Link href={`/products/${product.id}`} className="flex-1">
              <Button
                size="sm"
                variant="outline"
                className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      <CardContent className={cn("space-y-2", isMobile ? "p-2" : "p-3")}>
        <Link href={`/products/${product.id}`} className="block">
          <h3
            className={cn(
              "font-medium leading-tight line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-gray-100",
              isMobile ? "text-xs" : "text-sm"
            )}
          >
            {product.name}
          </h3>
        </Link>

        {/* 평점 */}
        <div className="flex items-center space-x-1">
          <Star
            className={cn(
              "fill-yellow-400 text-yellow-400",
              isMobile ? "w-2.5 h-2.5" : "w-3 h-3"
            )}
          />
          <span
            className={cn(
              "font-medium text-gray-900 dark:text-gray-100",
              isMobile ? "text-[10px]" : "text-xs"
            )}
          >
            {product.rating}
          </span>
          <span
            className={cn(
              "text-gray-500 dark:text-gray-400",
              isMobile ? "text-[10px]" : "text-xs"
            )}
          >
            ({product.reviewCount})
          </span>
        </div>

        {/* 가격 */}
        <div className="space-y-1">
          {isMobile ? (
            // 모바일: 할인율과 최종금액 표시
            <div>
              {discountPercentage > 0 ? (
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] text-red-500 font-medium">
                    {discountPercentage}%
                  </span>
                  <span
                    className={cn(
                      "font-bold",
                      saleTheme
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-900 dark:text-gray-100",
                      "text-xs"
                    )}
                  >
                    {salePrice.toLocaleString()}원
                  </span>
                  {originalPrice > salePrice && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 line-through">
                      {originalPrice.toLocaleString()}원
                    </span>
                  )}
                </div>
              ) : (
                <span
                  className={cn(
                    "font-bold block",
                    saleTheme
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-900 dark:text-gray-100",
                    "text-xs"
                  )}
                >
                  {salePrice.toLocaleString()}원
                </span>
              )}
            </div>
          ) : (
            // 데스크톱: 할인율과 최종금액 표시
            <div>
              {discountPercentage > 0 ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-red-500 font-medium">
                    {discountPercentage}%
                  </span>
                  <span
                    className={cn(
                      "font-bold",
                      saleTheme
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-900 dark:text-gray-100",
                      "text-sm"
                    )}
                  >
                    {salePrice.toLocaleString()}원
                  </span>
                  {originalPrice > salePrice && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                      {originalPrice.toLocaleString()}원
                    </span>
                  )}
                </div>
              ) : (
                <span
                  className={cn(
                    "font-bold",
                    saleTheme
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-900 dark:text-gray-100",
                    "text-sm"
                  )}
                >
                  {salePrice.toLocaleString()}원
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
