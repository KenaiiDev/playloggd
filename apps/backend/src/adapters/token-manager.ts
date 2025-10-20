export interface TokenManager {
  sign(payload: object): string;
  verify(token: string): object | null;
  getExpiration(): number | string;
}
