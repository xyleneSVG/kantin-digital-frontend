import { CardMenuItem } from "./shared/CardMenu";

export type HomeItem = {
  headerImage: string;
  canteenRecommendation: CardMenuItem[];
  category: CardMenuItem[];
  bestChoice: CardMenuItem[];
};
