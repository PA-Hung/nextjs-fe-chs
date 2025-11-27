export interface ZaloProduct {
  _id: string;
  code: string;
  name: string;
  maxGuests: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  priceNormal: number;
  location: string;
  amenities: string[];
  coverImageUrl: string;
}

export interface ZaloProductMeta {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface ZaloProductListResponse {
  statusCode: number;
  message: string;
  data: {
    meta: ZaloProductMeta;
    result: ZaloProduct[];
  };
}
