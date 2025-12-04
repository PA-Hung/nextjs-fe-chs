import { appConfig } from "@/lib/config";

export interface FeaturableReview {
  id: string;
  platform: string;
  author: {
    name: string;
    avatarUrl: string | null;
    profileUrl: string | null;
  };
  title: string | null;
  text: string;
  originalText: string;
  languageCode: string;
  rating: {
    value: number;
    max: number;
  };
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
  lastSyncedAt: string;
  metadata: Record<string, unknown>;
  url: string | null;
}

export interface FeaturableWidgetConfig {
  layout: string;
  language: string;
  name: string | null;
  color_scheme: string;
  name_display: string;
  title: string;
  show_title: boolean;
  carousel_autoplay: boolean;
  carousel_speed: number;
  max_characters: number;
  date_display: string;
  schema: boolean;
  schema_type: string | null;
  schema_sub_type: string | null;
  schema_sub_sub_type: string | null;
  summary: boolean;
  summary_review_button: boolean;
  show_profile_pictures: boolean;
  custom_css: string;
  allowed_domains: string[];
}

export interface FeaturableGBPLocationSummary {
  reviewsCount: number;
  rating: number;
  writeAReviewUri: string;
}

export interface FeaturableWidgetResponse {
  success: boolean;
  widget: {
    uuid: string;
    config: FeaturableWidgetConfig;
    reviews: FeaturableReview[];
    isExampleReviews: boolean;
    gbpLocationUuid: string;
    gbpLocationSummary: FeaturableGBPLocationSummary;
    showBranding: boolean;
  };
}

export const fetchFeaturableWidget = async (
  widgetId: string
): Promise<FeaturableWidgetResponse> => {
  const response = await fetch(
    `https://featurable.com/api/v2/widgets/${widgetId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600, // Cache 1 giờ
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Featurable widget: ${response.statusText}`
    );
  }

  return response.json();
};
