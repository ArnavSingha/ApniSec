import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

/**
 * A utility class for handling JSON Web Tokens (JWTs).
 * It uses the 'jose' library which is compatible with Edge runtimes.
 */
export class JwtManager {
  private static readonly ALGORITHM = 'HS256';
  
  private static getSecretKey(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set.');
    }
    return new TextEncoder().encode(secret);
  }

  /**
   * Signs a payload to create an access token.
   * @param payload - The data to include in the token.
   * @returns A promise that resolves to the signed JWT string.
   */
  public static async sign(payload: Record<string, any>): Promise<string> {
    const secretKey = this.getSecretKey();
    return new SignJWT(payload)
      .setProtectedHeader({ alg: this.ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(secretKey);
  }

  /**
   * Verifies a JWT.
   * @param token - The JWT string to verify.
   * @returns A promise that resolves to the token's payload if valid, or null otherwise.
   */
  public static async verify(token: string): Promise<Record<string, any> | null> {
    try {
      const secretKey = this.getSecretKey();
      const { payload } = await jwtVerify(token, secretKey);
      return payload;
    } catch (error) {
      // Errors like TokenExpiredError or SignatureVerificationError will be caught.
      return null;
    }
  }

  /**
   * Signs a payload to create a refresh token.
   * @param payload - The data to include in the token.
   * @returns A promise that resolves to the signed JWT string.
   */
  public static async refresh(payload: Record<string, any>): Promise<string> {
    const secretKey = this.getSecretKey();
    return new SignJWT(payload)
      .setProtectedHeader({ alg: this.ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secretKey);
  }
}
