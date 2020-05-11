export interface ValidatorsGateway {
  validateChangePasswordInput(input: any): void;
  validateFollowUserInput(input: any): void;
  validateGetUserDataInput(input: any): void;
  validateLoginInput(input: any): void;
  validateSignupInput(input: any): void;
  validateUpdateUserInput(input: any): void;
  validateCreateRecipeInput(input: any): void;
  validateGetFeedInput(input: any): void;
}
