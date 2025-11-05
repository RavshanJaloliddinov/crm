import * as jwt from 'jsonwebtoken';
import { config } from 'src/config';

interface JwtPayload {
    [key: string]: any; // Siz xohlagan payload maydonlari
}

export class JwtHelper {
    private static accessSecret = config.ACCESS_TOKEN_SECRET_KEY || 'default_access_secret';
    private static accessExpiresIn = config.ACCESS_TOKEN_EXPIRE_TIME as jwt.SignOptions['expiresIn'] || '2h';

    private static refreshSecret = config.REFRESH_TOKEN_SECRET_KEY || 'default_refresh_secret';
    private static refreshExpiresIn = config.REFRESH_TOKEN_EXPIRE_TIME as jwt.SignOptions['expiresIn'] || '7d';

    // Access token yaratish
    static signAccessToken<T extends JwtPayload>(payload: T): string {
        return jwt.sign(payload, this.accessSecret, { expiresIn: this.accessExpiresIn });
    }

    // Refresh token yaratish
    static signRefreshToken<T extends JwtPayload>(payload: T): string {
        return jwt.sign(payload, this.refreshSecret, { expiresIn: this.refreshExpiresIn });
    }

    // Access tokenni tekshirish
    static verifyAccessToken<T extends JwtPayload>(token: string): T | null {
        try {
            return jwt.verify(token, this.accessSecret) as T;
        } catch (err) {
            return null;
        }
    }

    // Refresh tokenni tekshirish
    static verifyRefreshToken<T extends JwtPayload>(token: string): T | null {
        try {
            return jwt.verify(token, this.refreshSecret) as T;
        } catch (err) {
            return null;
        }
    }
}
