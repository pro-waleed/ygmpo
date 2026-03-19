import { Module } from "@nestjs/common";
import { OfficialsController } from "./officials.controller";
import { OfficialsService } from "./officials.service";

@Module({ controllers: [OfficialsController], providers: [OfficialsService] })
export class OfficialsModule {}
