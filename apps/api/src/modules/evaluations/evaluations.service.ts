import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class EvaluationsService {
  constructor(private readonly prisma: PrismaService) {}

  getAxes() {
    return this.prisma.evaluationAxis.findMany({ include: { indicators: { orderBy: { displayOrder: "asc" } } }, orderBy: { displayOrder: "asc" } });
  }

  getPeriods() {
    return this.prisma.evaluationPeriod.findMany({ orderBy: [{ year: "desc" }, { month: "desc" }] });
  }

  async getScoreboard() {
    const period = await this.prisma.evaluationPeriod.findFirst({ where: { status: "OPEN" }, orderBy: { startDate: "desc" } });
    if (!period) return [];
    return this.prisma.score.findMany({ where: { periodId: period.id, axisId: null }, include: { subject: { include: { ministry: true, official: { include: { ministry: true } } } } }, orderBy: { totalScore: "desc" } });
  }
}
