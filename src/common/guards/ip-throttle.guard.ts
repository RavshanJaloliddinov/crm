import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class IpThrottleGuard extends ThrottlerGuard {
  // IP bo'yicha limiter (Proxy ostida ham ishlaydi)
  protected async getTracker(req: any): Promise<string> {
    const xff = req.headers?.['x-forwarded-for'];
    if (xff) {
      const ips = Array.isArray(xff) ? xff : String(xff).split(',');
      if (ips.length) return ips[0].trim();
    }

    if (req.ip) return req.ip;
    if (req.ips && req.ips.length) return req.ips[0]; // fastify / proxy
    if (req.connection?.remoteAddress) return req.connection.remoteAddress;

    return 'unknown';
  }
}
