type CanteenRecommendationItem = {
  id: string;
  image: string;
  name: string;
  rating: number;
};

export type HomeItem = {
  headerImage: string;
  canteenRecommendation: CanteenRecommendationItem[];
};
