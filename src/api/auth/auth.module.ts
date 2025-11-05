import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { RedisCacheService } from "src/infrastructure/redis/redis.service";

@Module({
    providers: [AuthService, RedisCacheService],
    controllers: [AuthController],
})
export class AuthModule { }