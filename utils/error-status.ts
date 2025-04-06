export const ErrorValidation = "VALIDATION" as const;
export const ErrorInvalidAuthId = "INVALID_AUTH_ID" as const;
export const ErrorUnknownDatabase = "UNKNOWN_DATABASE" as const;
export const ErrorUserInvalidCredentials = "USER_INVALID_CREDENTIALS" as const;
export const ErrorInvalidPagination = "INVALID_PAGINATION" as const;
export const ErrorNotFound = "NOT_FOUND" as const;

export function getErrorDescription(
  errorStatus: string | undefined | null,
): string {
  switch (errorStatus) {
    case ErrorValidation:
      return "Niepoprawne dane ;(";
    case ErrorInvalidAuthId:
      return "Nieporpawny kod rejestracji, nie martw się, może następnym razem się uda :)";
    case ErrorUnknownDatabase:
      return "Niech to dunder świśnie. Coś jest grubo nie tak.";
    case ErrorUserInvalidCredentials:
      return "Niewłaściwe dane użytkownika. Jeśli chcesz się włamać to bardzo nie ładnie z twojej strony.";
    case ErrorInvalidPagination:
      return "A to to musi być akurat błąd po mojej stronie :O";
    default:
      return "Nierozpoznany błąd :(";
  }
}
