import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { MinistriesModule } from "./modules/ministries/ministries.module";
import { OfficialsModule } from "./modules/officials/officials.module";
import { EvaluationsModule } from "./modules/evaluations/evaluations.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { PublicModule } from "./modules/public/public.module";
import { ReportsModule } from "./modules/reports/reports.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, MinistriesModule, OfficialsModule, EvaluationsModule, DashboardModule, PublicModule, ReportsModule]
})
export class AppModule {}
