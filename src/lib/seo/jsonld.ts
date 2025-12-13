/**
 * JSON-LD Schema helpers cho SEO
 * Hỗ trợ tạo structured data cho Product, Article, Organization, v.v.
 */

export interface ReviewSchema {
  author: {
    name: string;
  };
  datePublished: string;
  reviewBody: string;
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
}

export interface ProductSchema {
  name: string;
  description: string;
  image: string | string[];
  price?: number; // Made optional to be safe, but we should ensure it exists for Offer
  priceCurrency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  url: string;
  brand?: {
    name: string;
    logo?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  review?: ReviewSchema[];
  offers?: {
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
    priceValidUntil?: string;
  };
}

export interface ArticleSchema {
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo?: {
      url: string;
      width?: number;
      height?: number;
    };
  };
  url: string;
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
}

export interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
    areaServed?: string;
  };
  sameAs?: string[];
}

export interface LodgingBusinessSchema {
  name: string;
  description: string;
  image: string | string[];
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  telephone?: string;
  priceRange?: string;
  starRating?: {
    ratingValue: number;
  };
  amenityFeature?: Array<{
    name: string;
  }>;
}

/**
 * Tạo JSON-LD schema cho Product (căn hộ/villa)
 */
export const generateProductSchema = (product: ProductSchema): object => {
  const nextYear = new Date().getFullYear() + 1;
  const priceValidUntil =
    product.offers?.priceValidUntil || `${nextYear}-12-31`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: Array.isArray(product.image) ? product.image : [product.image],
    url: product.url,
    ...(product.brand && {
      brand: {
        "@type": "Brand",
        name: product.brand.name,
        ...(product.brand.logo && { logo: product.brand.logo }),
      },
    }),
    ...(product.aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.aggregateRating.ratingValue,
        reviewCount: product.aggregateRating.reviewCount,
        ...(product.aggregateRating.bestRating && {
          bestRating: product.aggregateRating.bestRating,
        }),
        ...(product.aggregateRating.worstRating && {
          worstRating: product.aggregateRating.worstRating,
        }),
      },
    }),
    ...(product.review && {
      review: product.review.map((rev) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: rev.author.name,
        },
        datePublished: rev.datePublished,
        reviewBody: rev.reviewBody,
        reviewRating: {
          "@type": "Rating",
          ratingValue: rev.reviewRating.ratingValue,
          ...(rev.reviewRating.bestRating && {
            bestRating: rev.reviewRating.bestRating,
          }),
          ...(rev.reviewRating.worstRating && {
            worstRating: rev.reviewRating.worstRating,
          }),
        },
      })),
    }),
    offers: {
      "@type": "Offer",
      price: product.offers?.price || product.price,
      priceCurrency:
        product.offers?.priceCurrency || product.priceCurrency || "VND",
      availability: `https://schema.org/${
        product.offers?.availability || product.availability || "InStock"
      }`,
      url: product.offers?.url || product.url,
      priceValidUntil,
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "VN",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnNotPermitted",
        merchantReturnDays: 0,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "VN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "VND",
        },
      },
    },
  };
};

/**
 * Tạo JSON-LD schema cho Article/BlogPosting
 */
export const generateArticleSchema = (article: ArticleSchema): object => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    image: Array.isArray(article.image) ? article.image : [article.image],
    datePublished: article.datePublished,
    ...(article.dateModified && { dateModified: article.dateModified }),
    author: {
      "@type": "Person",
      name: article.author.name,
      ...(article.author.url && { url: article.author.url }),
    },
    publisher: {
      "@type": "Organization",
      name: article.publisher.name,
      ...(article.publisher.logo && {
        logo: {
          "@type": "ImageObject",
          url: article.publisher.logo.url,
          ...(article.publisher.logo.width && {
            width: article.publisher.logo.width,
          }),
          ...(article.publisher.logo.height && {
            height: article.publisher.logo.height,
          }),
        },
      }),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.mainEntityOfPage?.["@id"] || article.url,
    },
  };
};

/**
 * Tạo JSON-LD schema cho Organization
 */
export const generateOrganizationSchema = (org: OrganizationSchema): object => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.url,
    ...(org.logo && { logo: org.logo }),
    ...(org.contactPoint && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: org.contactPoint.telephone,
        contactType: org.contactPoint.contactType,
        ...(org.contactPoint.areaServed && {
          areaServed: org.contactPoint.areaServed,
        }),
      },
    }),
    ...(org.sameAs && { sameAs: org.sameAs }),
  };
};

/**
 * Tạo JSON-LD schema cho LodgingBusiness (homestay/hotel)
 */
export const generateLodgingBusinessSchema = (
  business: LodgingBusinessSchema
): object => {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: business.name,
    description: business.description,
    image: Array.isArray(business.image) ? business.image : [business.image],
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      ...(business.address.addressRegion && {
        addressRegion: business.address.addressRegion,
      }),
      ...(business.address.postalCode && {
        postalCode: business.address.postalCode,
      }),
      addressCountry: business.address.addressCountry,
    },
    ...(business.telephone && { telephone: business.telephone }),
    ...(business.priceRange && { priceRange: business.priceRange }),
    ...(business.starRating && {
      starRating: {
        "@type": "Rating",
        ratingValue: business.starRating.ratingValue,
      },
    }),
    ...(business.amenityFeature && {
      amenityFeature: business.amenityFeature.map((amenity) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity.name,
      })),
    }),
  };
};
