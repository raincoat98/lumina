import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// 상품 타입 정의
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // 원가
  salePrice?: number; // 할인가 (실제 판매가)
  originalPrice?: number; // 원가 (할인 전 가격, price와 동일, 하위 호환성 유지)
  category: string;
  subCategory?: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  sizeStocks?: Record<string, number>; // 사이즈별 재고 정보 (기본)
  colorSizeStocks?: Record<string, Record<string, number>>; // 색상별 사이즈별 재고 정보
  colorSizeAvailability?: Record<string, Record<string, boolean>>; // 색상별 사이즈별 사용 가능 여부
  isActive: boolean;
  isNew: boolean;
  isSale: boolean;
  isBest: boolean;
  isFeatured?: boolean;
  isLimited?: boolean;
  isHot?: boolean;
  collection?: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 주문 타입 정의
export interface Order {
  id: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    size: string;
    color: string;
    price: number;
  }[];
  totalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    detailAddress: string;
    zipCode: string;
  };
  paymentMethod: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// 장바구니 아이템 타입 정의
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  stock: number;
}

// 위시리스트 아이템 타입 정의
export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isSale: boolean;
  isBest: boolean;
  addedAt: string;
}

// 카테고리 타입 정의
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  subCategories: {
    id: string;
    name: string;
    slug: string;
    description: string;
  }[];
}

// 상품 스토어 타입
interface ProductStore {
  // 상품 데이터
  products: Product[];
  orders: Order[];
  categories: Category[];
  cart: CartItem[];
  wishlist: WishlistItem[];

  // 필터링 및 검색
  searchTerm: string;
  selectedCategory: string;
  selectedSubCategory: string;
  selectedCollection: string;
  priceRange: [number, number];
  selectedSizes: string[];
  selectedColors: string[];
  sortBy: "name" | "price" | "rating" | "createdAt";
  sortOrder: "asc" | "desc";
  showInactive: boolean; // 관리자용 비활성 상품 표시 옵션

  // 페이지네이션
  currentPage: number;
  itemsPerPage: number;

  // 선택된 상품 (수정용)
  selectedProduct: Product | null;

  // 액션들
  // 상품 관리
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;

  // 필터링 및 검색
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedSubCategory: (subCategory: string) => void;
  setSelectedCollection: (collection: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSelectedSizes: (sizes: string[]) => void;
  setSelectedColors: (colors: string[]) => void;
  setSortBy: (sortBy: "name" | "price" | "rating" | "createdAt") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setShowInactive: (show: boolean) => void;
  resetFilters: () => void;

  // 페이지네이션
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;

  // 선택된 상품
  setSelectedProduct: (product: Product | null) => void;

  // 주문 관리
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  getOrderById: (id: string) => Order | undefined;

  // 카테고리 관리
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryBySlug: (slug: string) => Category | undefined;

  // 장바구니 관리
  addToCart: (item: Omit<CartItem, "id">) => void;
  updateCartItem: (id: string, updates: Partial<CartItem>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartItemById: (id: string) => CartItem | undefined;

  // 위시리스트 관리
  addToWishlist: (item: Omit<WishlistItem, "id" | "addedAt">) => void;
  removeFromWishlist: (id: string) => void;
  removeFromWishlistByProductId: (productId: string) => void;
  clearWishlist: () => void;
  getWishlistItemById: (id: string) => WishlistItem | undefined;
  isInWishlist: (productId: string) => boolean;

  // 계산된 값들
  filteredProducts: Product[];
  paginatedProducts: Product[];
  totalPages: number;
  categoryNames: string[];
  subCategories: string[];
  cartTotal: number;
  cartItemCount: number;
  wishlistCount: number;
}

// 샘플 상품 데이터
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "LUMINA 클래식 블라우스",
    description:
      "세련된 디자인의 클래식 블라우스로 어떤 자리에서도 우아함을 연출합니다.",
    price: 89000, // 할인가
    originalPrice: 120000, // 원가
    category: "top",
    subCategory: "블라우스",
    images: [
      "https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1805411/pexels-photo-1805411.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["화이트", "블랙", "네이비"],
    stock: 50,
    sizeStocks: {
      XS: 8,
      S: 12,
      M: 15,
      L: 10,
      XL: 5,
    },
    colorSizeStocks: {
      화이트: { XS: 3, S: 4, M: 5, L: 3, XL: 2 },
      블랙: { XS: 3, S: 4, M: 5, L: 4, XL: 2 },
      네이비: { XS: 2, S: 4, M: 5, L: 3, XL: 1 },
    },
    colorSizeAvailability: {
      화이트: { XS: true, S: true, M: true, L: true, XL: true },
      블랙: { XS: true, S: true, M: true, L: true, XL: true },
      네이비: { XS: true, S: true, M: true, L: true, XL: false }, // 네이비는 XL 사이즈 없음
    },
    isActive: true,
    isNew: true,
    isSale: true, // originalPrice > price 이므로 할인 상품
    isBest: false,
    isFeatured: false,
    isLimited: false,
    isHot: false,
    collection: "basic",
    rating: 4.8,
    reviewCount: 127,
    tags: ["클래식", "오피스", "데이트"],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "LUMINA 슬림 팬츠",
    description: "편안하면서도 세련된 실루엣의 슬림 팬츠입니다.",
    price: 129000, // 정가 (할인 없음)
    category: "bottom",
    subCategory: "팬츠",
    images: [
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["베이지", "블랙", "그레이"],
    stock: 35,
    sizeStocks: {
      S: 8,
      M: 12,
      L: 10,
      XL: 5,
    },
    colorSizeStocks: {
      베이지: { S: 2, M: 3, L: 3, XL: 2 },
      블랙: { S: 3, M: 4, L: 3, XL: 2 },
      그레이: { S: 3, M: 5, L: 4, XL: 1 },
    },
    colorSizeAvailability: {
      베이지: { S: true, M: true, L: true, XL: true },
      블랙: { S: true, M: true, L: true, XL: true },
      그레이: { S: true, M: true, L: true, XL: false }, // 그레이는 XL 사이즈 없음
    },
    isActive: true,
    isNew: false,
    isSale: false, // 할인 없음
    isBest: true,
    isFeatured: true,
    isLimited: false,
    isHot: false,
    collection: "basic",
    rating: 4.9,
    reviewCount: 89,
    tags: ["슬림", "오피스", "캐주얼"],
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "3",
    name: "LUMINA 플로럴 원피스",
    description: "우아한 플로럴 패턴의 원피스로 봄날의 로맨스를 완성합니다.",
    price: 159000, // 할인가
    originalPrice: 199000, // 원가
    category: "dress",
    subCategory: "미니원피스",
    images: [
      "https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2703907/pexels-photo-2703907.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["블루", "핑크"],
    stock: 25,
    sizeStocks: {
      XS: 5,
      S: 8,
      M: 7,
      L: 5,
    },
    colorSizeStocks: {
      블루: { XS: 2, S: 4, M: 3, L: 2 },
      핑크: { XS: 3, S: 4, M: 4, L: 3 },
    },
    isActive: true,
    isNew: true,
    isSale: true, // originalPrice > price 이므로 할인 상품
    isBest: false,
    isFeatured: false,
    isLimited: true,
    isHot: true,
    collection: "special",
    rating: 4.7,
    reviewCount: 156,
    tags: ["플로럴", "데이트", "파티"],
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "4",
    name: "LUMINA 니트 카디건",
    description:
      "부드러운 니트 소재의 카디건으로 따뜻함과 스타일을 동시에 만족합니다.",
    price: 99000, // 정가 (할인 없음)
    category: "top",
    subCategory: "니트",
    images: [
      "https://images.pexels.com/photos/2703907/pexels-photo-2703907.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6811705/pexels-photo-6811705.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["아이보리", "그레이", "베이지"],
    stock: 40,
    sizeStocks: {
      S: 8,
      M: 12,
      L: 12,
      XL: 8,
    },
    colorSizeStocks: {
      아이보리: { S: 3, M: 4, L: 4, XL: 3 },
      그레이: { S: 3, M: 4, L: 4, XL: 2 },
      베이지: { S: 2, M: 4, L: 4, XL: 3 },
    },
    isActive: true,
    isNew: false,
    isSale: false, // 할인 없음
    isBest: true,
    isFeatured: true,
    isLimited: false,
    isHot: false,
    collection: "basic",
    rating: 4.6,
    reviewCount: 203,
    tags: ["니트", "캐주얼", "레이어드"],
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "5",
    name: "LUMINA 데님 스커트",
    description:
      "클래식한 데님 스커트로 캐주얼하면서도 세련된 룩을 완성합니다.",
    price: 79000, // 할인가
    originalPrice: 99000, // 원가
    category: "bottom",
    subCategory: "스커트",
    images: [
      "https://images.pexels.com/photos/1021694/pexels-photo-1021694.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1805411/pexels-photo-1805411.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["라이트블루", "다크블루"],
    stock: 30,
    sizeStocks: {
      XS: 6,
      S: 8,
      M: 10,
      L: 6,
    },
    colorSizeStocks: {
      라이트블루: { XS: 3, S: 4, M: 5, L: 3 },
      다크블루: { XS: 3, S: 4, M: 5, L: 3 },
    },
    isActive: false,
    isNew: false,
    isSale: true, // originalPrice > price 이므로 할인 상품
    isBest: false,
    isFeatured: false,
    isLimited: false,
    isHot: false,
    collection: "basic",
    rating: 4.5,
    reviewCount: 78,
    tags: ["데님", "캐주얼", "베이직"],
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
  },
  {
    id: "6",
    name: "LUMINA 베이직 티셔츠",
    description: "편안하고 실용적인 베이직 티셔츠입니다.",
    price: 29000, // 정가 (할인 없음)
    category: "top",
    subCategory: "티셔츠",
    images: [
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["화이트", "블랙", "그레이"],
    stock: 100,
    sizeStocks: {
      S: 20,
      M: 30,
      L: 30,
      XL: 20,
    },
    colorSizeStocks: {
      화이트: { S: 7, M: 10, L: 10, XL: 7 },
      블랙: { S: 7, M: 10, L: 10, XL: 7 },
      그레이: { S: 6, M: 10, L: 10, XL: 6 },
    },
    isActive: true,
    isNew: false,
    isSale: false, // 할인 없음
    isBest: true,
    isFeatured: true,
    isLimited: false,
    isHot: false,
    collection: "basic",
    rating: 4.7,
    reviewCount: 234,
    tags: ["베이직", "캐주얼", "데일리"],
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "7",
    name: "LUMINA 와이드 팬츠",
    description: "편안한 착용감의 와이드 팬츠입니다.",
    price: 79000, // 할인가
    originalPrice: 99000, // 원가
    category: "bottom",
    subCategory: "팬츠",
    images: [
      "https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["베이지", "블랙", "네이비"],
    stock: 45,
    sizeStocks: {
      S: 10,
      M: 15,
      L: 12,
      XL: 8,
    },
    colorSizeStocks: {
      베이지: { S: 3, M: 5, L: 4, XL: 3 },
      블랙: { S: 4, M: 5, L: 4, XL: 2 },
      네이비: { S: 3, M: 5, L: 4, XL: 3 },
    },
    isActive: true,
    isNew: false,
    isSale: true, // originalPrice > price 이므로 할인 상품
    isBest: false,
    isFeatured: false,
    isLimited: false,
    isHot: false,
    collection: "basic",
    rating: 4.6,
    reviewCount: 156,
    tags: ["와이드", "캐주얼", "오피스"],
    createdAt: "2024-01-18T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
  {
    id: "8",
    name: "LUMINA 미디 원피스",
    description: "우아하고 세련된 미디 원피스입니다.",
    price: 139000, // 정가 (할인 없음)
    category: "dress",
    subCategory: "미디원피스",
    images: [
      "https://images.pexels.com/photos/2703907/pexels-photo-2703907.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6811705/pexels-photo-6811705.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["블랙", "네이비", "브라운"],
    stock: 30,
    sizeStocks: {
      XS: 6,
      S: 8,
      M: 10,
      L: 6,
    },
    colorSizeStocks: {
      블랙: { XS: 2, S: 3, M: 4, L: 2 },
      네이비: { XS: 2, S: 3, M: 3, L: 2 },
      브라운: { XS: 2, S: 2, M: 3, L: 2 },
    },
    isActive: true,
    isNew: true,
    isSale: false, // 할인 없음
    isBest: false,
    isFeatured: true,
    isLimited: false,
    isHot: true,
    collection: "special",
    rating: 4.8,
    reviewCount: 89,
    tags: ["미디", "데이트", "파티"],
    createdAt: "2024-01-22T00:00:00Z",
    updatedAt: "2024-01-22T00:00:00Z",
  },
  {
    id: "9",
    name: "LUMINA 트렌치 코트",
    description: "클래식한 트렌치 코트로 세련된 룩을 완성합니다.",
    price: 199000, // 할인가
    originalPrice: 249000, // 원가
    category: "outer",
    subCategory: "코트",
    images: [
      "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1805411/pexels-photo-1805411.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["S", "M", "L"],
    colors: ["베이지", "블랙", "카키"],
    stock: 25,
    sizeStocks: {
      S: 8,
      M: 10,
      L: 7,
    },
    colorSizeStocks: {
      베이지: { S: 3, M: 4, L: 3 },
      블랙: { S: 3, M: 3, L: 2 },
      카키: { S: 2, M: 3, L: 2 },
    },
    isActive: true,
    isNew: false,
    isSale: true, // originalPrice > price 이므로 할인 상품
    isBest: true,
    isFeatured: true,
    isLimited: false,
    isHot: false,
    collection: "outer",
    rating: 4.9,
    reviewCount: 167,
    tags: ["트렌치", "클래식", "오피스"],
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "10",
    name: "LUMINA 데님 자켓",
    description: "캐주얼하면서도 세련된 데님 자켓입니다.",
    price: 89000, // 정가 (할인 없음)
    category: "outer",
    subCategory: "자켓",
    images: [
      "https://images.pexels.com/photos/1021694/pexels-photo-1021694.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["라이트블루", "다크블루", "블랙"],
    stock: 40,
    sizeStocks: {
      S: 8,
      M: 12,
      L: 12,
      XL: 8,
    },
    colorSizeStocks: {
      라이트블루: { S: 3, M: 4, L: 4, XL: 3 },
      다크블루: { S: 3, M: 4, L: 4, XL: 3 },
      블랙: { S: 2, M: 4, L: 4, XL: 2 },
    },
    isActive: true,
    isNew: false,
    isSale: false, // 할인 없음
    isBest: false,
    isFeatured: false,
    isLimited: false,
    isHot: true,
    collection: "outer",
    rating: 4.5,
    reviewCount: 123,
    tags: ["데님", "캐주얼", "베이직"],
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
  },
];

// 샘플 카테고리 데이터
const sampleCategories: Category[] = [
  {
    id: "1",
    name: "상의",
    slug: "top",
    description: "티셔츠, 블라우스, 니트 등 다양한 상의",
    image: "/images/categories/top.jpg",
    isActive: true,
    subCategories: [
      {
        id: "1-1",
        name: "티셔츠",
        slug: "tshirt",
        description: "기본 티셔츠부터 특별한 디자인의 티셔츠까지",
      },
      {
        id: "1-2",
        name: "블라우스",
        slug: "blouse",
        description: "우아하고 세련된 블라우스 컬렉션",
      },
      {
        id: "1-3",
        name: "니트",
        slug: "knit",
        description: "부드럽고 따뜻한 니트웨어",
      },
    ],
  },
  {
    id: "2",
    name: "하의",
    slug: "bottom",
    description: "팬츠, 스커트 등 다양한 하의",
    image: "/images/categories/bottom.jpg",
    isActive: true,
    subCategories: [
      {
        id: "2-1",
        name: "팬츠",
        slug: "pants",
        description: "데님, 슬랙스 등 다양한 팬츠",
      },
      {
        id: "2-2",
        name: "스커트",
        slug: "skirt",
        description: "미니, 미디, 맥시 스커트",
      },
    ],
  },
  {
    id: "3",
    name: "원피스",
    slug: "dress",
    description: "우아하고 세련된 원피스 컬렉션",
    image: "/images/categories/dress.jpg",
    isActive: true,
    subCategories: [
      {
        id: "3-1",
        name: "미니원피스",
        slug: "mini-dress",
        description: "귀엽고 사랑스러운 미니 원피스",
      },
      {
        id: "3-2",
        name: "미디원피스",
        slug: "midi-dress",
        description: "우아하고 세련된 미디 원피스",
      },
    ],
  },
];

// 샘플 주문 데이터
const sampleOrders: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    products: [
      {
        productId: "1",
        quantity: 1,
        size: "M",
        color: "화이트",
        price: 89000,
      },
    ],
    totalAmount: 92000,
    shippingAddress: {
      name: "김민수",
      phone: "010-1234-5678",
      address: "서울특별시 강남구",
      detailAddress: "테헤란로 123",
      zipCode: "06123",
    },
    paymentMethod: "신용카드",
    status: "paid",
    createdAt: "2024-01-25T10:30:00Z",
    updatedAt: "2024-01-25T10:30:00Z",
  },
  {
    id: "order-2",
    userId: "user-2",
    products: [
      {
        productId: "2",
        quantity: 1,
        size: "L",
        color: "블랙",
        price: 129000,
      },
      {
        productId: "4",
        quantity: 1,
        size: "M",
        color: "아이보리",
        price: 99000,
      },
    ],
    totalAmount: 238000,
    shippingAddress: {
      name: "이영희",
      phone: "010-9876-5432",
      address: "서울특별시 서초구",
      detailAddress: "서초대로 456",
      zipCode: "06611",
    },
    paymentMethod: "간편결제",
    status: "shipped",
    createdAt: "2024-01-24T15:45:00Z",
    updatedAt: "2024-01-25T09:15:00Z",
  },
];

// Zustand 스토어 생성
export const useProductStore = create<ProductStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      products: (() => {
        console.log("상품 스토어 초기화 - 샘플 상품:", sampleProducts);
        return sampleProducts;
      })(),
      orders: sampleOrders,
      categories: sampleCategories,
      cart: [],
      wishlist: [],

      // 필터링 및 검색
      searchTerm: "",
      selectedCategory: "",
      selectedSubCategory: "",
      selectedCollection: "",
      priceRange: [0, 500000],
      selectedSizes: [],
      selectedColors: [],
      sortBy: "createdAt",
      sortOrder: "desc",
      showInactive: true, // 관리자 페이지에서는 기본적으로 모든 상품 표시

      // 페이지네이션
      currentPage: 1,
      itemsPerPage: 12,

      // 선택된 상품
      selectedProduct: null,

      // 상품 관리 액션들
      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        console.log("새 상품 추가:", newProduct);
        set((state) => {
          // 중복 추가 방지
          const existingProduct = state.products.find(
            (p) => p.name === newProduct.name
          );
          if (existingProduct) {
            console.log("이미 존재하는 상품:", existingProduct.name);
            return state;
          }

          const updatedProducts = [...state.products, newProduct];
          console.log("업데이트된 상품 목록:", updatedProducts);
          return {
            products: updatedProducts,
          };
        });
      },

      updateProduct: (id, updates) => {
        console.log("상품 업데이트:", id);

        set((state) => {
          const oldProduct = state.products.find((p) => p.id === id);
          if (!oldProduct) {
            console.error("업데이트할 상품을 찾을 수 없습니다:", id);
            return state;
          }

          const newProducts = state.products.map((product) =>
            product.id === id
              ? {
                  ...product,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : product
          );

          return {
            products: newProducts,
          };
        });
      },

      deleteProduct: (id) => {
        console.log("deleteProduct 호출:", id);
        set((state) => {
          const productToDelete = state.products.find((p) => p.id === id);
          console.log("삭제할 상품:", productToDelete);

          if (!productToDelete) {
            console.error("삭제할 상품을 찾을 수 없습니다:", id);
            return state;
          }

          const newProducts = state.products.filter(
            (product) => product.id !== id
          );
          console.log("삭제 후 상품 목록:", newProducts);

          return {
            products: newProducts,
          };
        });
      },

      getProductById: (id) => {
        const { products } = get();
        return products.find((product) => product.id === id);
      },

      // 필터링 및 검색 액션들
      setSearchTerm: (term) => {
        console.log("setSearchTerm 호출:", term);
        set({ searchTerm: term, currentPage: 1 });
      },
      setSelectedCategory: (category) => {
        console.log("setSelectedCategory 호출:", category);
        set({
          selectedCategory: category,
          selectedSubCategory: "",
          currentPage: 1,
        });
      },
      setSelectedSubCategory: (subCategory) =>
        set({ selectedSubCategory: subCategory, currentPage: 1 }),
      setSelectedCollection: (collection) => {
        console.log("setSelectedCollection 호출:", collection);
        set({ selectedCollection: collection, currentPage: 1 });
      },
      setPriceRange: (range) => set({ priceRange: range, currentPage: 1 }),
      setSelectedSizes: (sizes) =>
        set({ selectedSizes: sizes, currentPage: 1 }),
      setSelectedColors: (colors) =>
        set({ selectedColors: colors, currentPage: 1 }),
      setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
      setSortOrder: (order) => set({ sortOrder: order, currentPage: 1 }),
      setShowInactive: (show) => {
        console.log("setShowInactive 호출:", show);
        set({ showInactive: show, currentPage: 1 });
      },

      resetFilters: () => {
        console.log("resetFilters 호출");
        set({
          searchTerm: "",
          selectedCategory: "",
          selectedSubCategory: "",
          selectedCollection: "",
          priceRange: [0, 500000],
          selectedSizes: [],
          selectedColors: [],
          sortBy: "createdAt",
          sortOrder: "desc",
          showInactive: true, // 관리자 페이지에서는 기본적으로 모든 상품 표시
          currentPage: 1,
        });
      },

      // 페이지네이션 액션들
      setCurrentPage: (page) => set({ currentPage: page }),
      setItemsPerPage: (items) => set({ itemsPerPage: items, currentPage: 1 }),

      // 선택된 상품 액션
      setSelectedProduct: (product) => set({ selectedProduct: product }),

      // 주문 관리 액션들
      addOrder: (order) => {
        const newOrder: Order = {
          ...order,
          id: `order-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          orders: [...state.orders, newOrder],
        }));
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          ),
        }));
      },

      getOrderById: (id) => {
        const { orders } = get();
        return orders.find((order) => order.id === id);
      },

      // 카테고리 관리 액션들
      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: Date.now().toString(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },

      getCategoryBySlug: (slug) => {
        const { categories } = get();
        return categories.find((category) => category.slug === slug);
      },

      // 장바구니 관리 액션들
      addToCart: (item) => {
        const newCartItem: CartItem = {
          ...item,
          id: Date.now().toString(),
        };
        set((state) => ({
          cart: [...state.cart, newCartItem],
        }));
      },

      updateCartItem: (id, updates) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getCartItemById: (id) => {
        const { cart } = get();
        return cart.find((item) => item.id === id);
      },

      // 위시리스트 관리 액션들
      addToWishlist: (item) => {
        const newWishlistItem: WishlistItem = {
          ...item,
          id: Date.now().toString(),
          addedAt: new Date().toISOString(),
        };
        set((state) => ({
          wishlist: [...state.wishlist, newWishlistItem],
        }));
      },

      removeFromWishlist: (id) => {
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== id),
        }));
      },

      removeFromWishlistByProductId: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter(
            (item) => item.productId !== productId
          ),
        }));
      },

      clearWishlist: () => {
        set({ wishlist: [] });
      },

      getWishlistItemById: (id) => {
        const { wishlist } = get();
        return wishlist.find((item) => item.id === id);
      },

      isInWishlist: (productId) => {
        const { wishlist } = get();
        return wishlist.some((item) => item.productId === productId);
      },

      // 계산된 값들
      get filteredProducts() {
        const {
          products,
          searchTerm,
          selectedCategory,
          selectedSubCategory,
          priceRange,
          selectedSizes,
          selectedColors,
          sortBy,
          sortOrder,
          showInactive,
        } = get();

        console.log("filteredProducts 계산 시작:", {
          productsLength: products.length,
          searchTerm,
          selectedCategory,
          showInactive,
        });

        let filtered = products;

        // 활성화 상품 필터링 (showInactive가 false인 경우만)
        if (!showInactive) {
          console.log("활성화 상품만 필터링");
          filtered = filtered.filter((product) => product.isActive);
        } else {
          console.log("모든 상품 표시 (비활성화 포함)");
        }

        // 검색어 필터링
        if (searchTerm) {
          console.log("검색어 필터링:", searchTerm);
          filtered = filtered.filter(
            (product) =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              product.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
              )
          );
          console.log("검색어 필터링 후 상품 수:", filtered.length);
        }

        // 카테고리 필터링
        if (selectedCategory) {
          console.log("카테고리 필터링:", selectedCategory);
          filtered = filtered.filter(
            (product) => product.category === selectedCategory
          );
          console.log("카테고리 필터링 후 상품 수:", filtered.length);
        }

        // 서브카테고리 필터링
        if (selectedSubCategory) {
          filtered = filtered.filter(
            (product) => product.subCategory === selectedSubCategory
          );
        }

        // 컬렉션 필터링은 ProductManager에서 처리
        // if (selectedCollection && selectedCollection !== "all") {
        //   filtered = filtered.filter(
        //     (product) => product.collection === selectedCollection
        //   );
        // }

        // 가격 범위 필터링
        filtered = filtered.filter(
          (product) =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // 사이즈 필터링
        if (selectedSizes.length > 0) {
          filtered = filtered.filter((product) =>
            selectedSizes.some((size) => product.sizes.includes(size))
          );
        }

        // 색상 필터링
        if (selectedColors.length > 0) {
          filtered = filtered.filter((product) =>
            selectedColors.some((color) => product.colors.includes(color))
          );
        }

        // 정렬
        filtered.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (sortBy) {
            case "name":
              aValue = a.name;
              bValue = b.name;
              break;
            case "price":
              aValue = a.price;
              bValue = b.price;
              break;
            case "rating":
              aValue = a.rating;
              bValue = b.rating;
              break;
            case "createdAt":
              aValue = new Date(a.createdAt);
              bValue = new Date(b.createdAt);
              break;
            default:
              aValue = a.name;
              bValue = b.name;
          }

          if (sortOrder === "asc") {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        console.log("filteredProducts 계산 완료:", {
          originalLength: products.length,
          filteredLength: filtered.length,
          firstProduct: filtered[0],
        });

        return filtered;
      },

      get paginatedProducts() {
        const { filteredProducts, currentPage, itemsPerPage } = get();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
      },

      get totalPages() {
        const { filteredProducts, itemsPerPage } = get();
        return Math.ceil(filteredProducts.length / itemsPerPage);
      },

      get categoryNames() {
        const { products } = get();
        return Array.from(new Set(products.map((product) => product.category)));
      },

      get subCategories() {
        const { products, selectedCategory } = get();
        if (!selectedCategory) return [];
        return Array.from(
          new Set(
            products
              .filter((product) => product.category === selectedCategory)
              .map((product) => product.subCategory)
              .filter((subCat): subCat is string => Boolean(subCat))
          )
        );
      },

      get cartTotal() {
        const { cart } = get();
        return cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      get cartItemCount() {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      get wishlistCount() {
        const { wishlist } = get();
        return wishlist.length;
      },
    }),
    {
      name: "product-store",
    }
  )
);
