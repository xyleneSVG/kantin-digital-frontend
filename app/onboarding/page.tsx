import OnBoardingPage from "@/src/components/commons/Onboarding";
import AuthWrapper from "@/src/components/commons/AuthWrapper";

export default function OnboardingRoute() {
  return (
    <AuthWrapper>
      <OnBoardingPage />
    </AuthWrapper>
  );
}
