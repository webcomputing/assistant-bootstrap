import { strategies } from "assistant-authentication";

export class OAuthStrategy extends strategies.AccessTokenAuthentication {
  async validateAccessToken(token: string) {
    // TODO: Implement intelligent access token behaviour!
    return true;
  }
}