interface TokenInfo {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export class TokenManager {
  private token: string | null = null;
  private expirationTime: number | null = null;
  private readonly refreshThreshold = 300;

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly tokenUrl: string = "https://id.twitch.tv/oauth2/token"
  ) {}

  async getToken(): Promise<string> {
    if (!this.token || this.shouldRefreshToken()) {
      await this.refreshToken();
    }
    return this.token!;
  }

  private shouldRefreshToken(): boolean {
    if (!this.expirationTime) return true;

    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime + this.refreshThreshold >= this.expirationTime;
  }

  private async refreshToken(): Promise<void> {
    try {
      const response = await fetch(
        `${this.tokenUrl}?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.statusText}`);
      }

      const tokenInfo: TokenInfo = await response.json();

      this.token = tokenInfo.access_token;

      this.expirationTime =
        Math.floor(Date.now() / 1000) + tokenInfo.expires_in;
    } catch (error) {
      throw new Error(`Token refresh failed: ${(error as Error).message}`);
    }
  }
}
