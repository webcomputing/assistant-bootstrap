import { strategies } from "assistant-authentication";

/**
 * This is an example oAuth strategy. You can use it to check your oAuth token for validity and 
 * even inject resulting user data.
 * 
 * After filling this strategy with useful content, just use @authenticate(OAuthStrategy) to add 
 * an authentication interception.
 */
export class OAuthStrategy extends strategies.AccessTokenAuthentication {
  async validateAccessToken(token: string) {
    // TODO: Implement your own intelligent access token behaviour!
    return true;
  }
}