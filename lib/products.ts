import { Product } from "@/stores/useProductStore";

// 서버 사이드에서 사용할 수 있는 상품 데이터
// 실제 프로덕션에서는 데이터베이스나 API에서 가져와야 함
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "LUMINA 클래식 블라우스",
    description:
      "세련된 디자인의 클래식 블라우스로 어떤 자리에서도 우아함을 연출합니다.",
    price: 89000,
    originalPrice: 120000,
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
    isActive: true,
    isNew: true,
    isSale: true,
    isBest: false,
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
    price: 129000,
    category: "bottom",
    subCategory: "팬츠",
    images: [
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["베이지", "블랙", "그레이"],
    stock: 35,
    isActive: true,
    isNew: false,
    isSale: false,
    isBest: true,
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
    price: 159000,
    originalPrice: 199000,
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
    isActive: true,
    isNew: true,
    isSale: true,
    isBest: false,
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
    price: 99000,
    category: "top",
    subCategory: "니트",
    images: [
      "https://images.pexels.com/photos/2703907/pexels-photo-2703907.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6811705/pexels-photo-6811705.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["아이보리", "그레이", "베이지"],
    stock: 40,
    isActive: true,
    isNew: false,
    isSale: false,
    isBest: true,
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
    price: 79000,
    originalPrice: 99000,
    category: "bottom",
    subCategory: "스커트",
    images: [
      "https://images.pexels.com/photos/1021694/pexels-photo-1021694.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1805411/pexels-photo-1805411.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["라이트블루", "다크블루"],
    stock: 30,
    isActive: false,
    isNew: false,
    isSale: true,
    isBest: false,
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
    price: 29000,
    category: "top",
    subCategory: "티셔츠",
    images: [
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["화이트", "블랙", "그레이"],
    stock: 100,
    isActive: true,
    isNew: false,
    isSale: false,
    isBest: true,
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
    price: 79000,
    originalPrice: 99000,
    category: "bottom",
    subCategory: "팬츠",
    images: [
      "https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["베이지", "블랙", "네이비"],
    stock: 45,
    isActive: true,
    isNew: false,
    isSale: true,
    isBest: false,
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
    price: 139000,
    category: "dress",
    subCategory: "미디원피스",
    images: [
      "https://images.pexels.com/photos/2703907/pexels-photo-2703907.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6811705/pexels-photo-6811705.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["블랙", "네이비", "브라운"],
    stock: 30,
    isActive: true,
    isNew: true,
    isSale: false,
    isBest: false,
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
    price: 199000,
    originalPrice: 249000,
    category: "outer",
    subCategory: "코트",
    images: [
      "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1805411/pexels-photo-1805411.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["S", "M", "L"],
    colors: ["베이지", "블랙", "카키"],
    stock: 25,
    isActive: true,
    isNew: false,
    isSale: true,
    isBest: true,
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
    price: 89000,
    category: "outer",
    subCategory: "자켓",
    images: [
      "https://images.pexels.com/photos/1021694/pexels-photo-1021694.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["라이트블루", "다크블루", "블랙"],
    stock: 40,
    isActive: true,
    isNew: false,
    isSale: false,
    isBest: false,
    rating: 4.5,
    reviewCount: 123,
    tags: ["데님", "캐주얼", "베이직"],
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
  },
];

/**
 * 서버 사이드에서 모든 활성 상품을 가져옵니다
 */
export function getAllProducts(): Product[] {
  return sampleProducts.filter((product) => product.isActive);
}

/**
 * 서버 사이드에서 상품 ID로 상품을 가져옵니다
 */
export function getProductById(id: string): Product | undefined {
  return sampleProducts.find((product) => product.id === id);
}

/**
 * 서버 사이드에서 카테고리별 상품을 가져옵니다
 */
export function getProductsByCategory(category: string): Product[] {
  return sampleProducts.filter(
    (product) => product.category === category && product.isActive
  );
}

/**
 * 사이트의 기본 URL을 반환합니다
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://lumina-ecommerce.com";
}

