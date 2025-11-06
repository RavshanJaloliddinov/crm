import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/common/guards/AuthGuard';
import { JwtStrategy } from 'src/common/middlewares/AuthStrategy';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { CourseModule } from './course/course.module';
import { InstructorModule } from './instructor/instructor.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { IpThrottleGuard } from 'src/common/guards/ip-throttle.guard';

@Module({
  imports: [
    // Global Throttler konfiguratsiyasi
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 3_600_000, // 1 daqiqa = 60000 ms
        limit: 5,    // shu TTL ichida 5 ta so'rov
      },
    ]),
    PrismaModule,
    UserModule,
    StudentModule,
    CourseModule,
    InstructorModule,
    EnrollmentModule,
    RedisModule,
    AuthModule,
  ],
  providers: [ 
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // default auth guard
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: IpThrottleGuard, // global IP bo‘yicha limiter
    // },
  ],
})
export class AppModule {}
