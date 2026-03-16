import { HomeItem } from "./Home";
import { LoginItem } from "./Login";
import { OnboardingItem } from "./Onboarding";

export type DataType = {
  onboarding: OnboardingItem[];
  login: LoginItem
  home: HomeItem
};