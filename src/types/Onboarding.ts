type OnboardingButtonVariant = {
  color: string;
  text: string;
  icon: string;
  textColor: string;
  type: string
};

type OnboardingBase = {
  step: number;
  heading: string;
  illustration: string;
  title: string;
  description: string;
};

type OnboardingSingleButton = OnboardingBase & {
  buttonType: "single";
  buttonSingleText: string;
  inputPlaceholder: string;
  inputType: string;
  inputName: string;
};

type OnboardingDoubleButton = OnboardingBase & {
  buttonType: "double";
  buttonVariant: OnboardingButtonVariant[];
};

export type OnboardingItem =
  | OnboardingSingleButton
  | OnboardingDoubleButton;