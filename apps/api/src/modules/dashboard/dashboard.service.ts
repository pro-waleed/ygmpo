import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const latestPeriod = await this.prisma.evaluationPeriod.findFirst({ orderBy: { startDate: "desc" } });
    if (!latestPeriod) return null;

    const ministryScores = await this.prisma.score.findMany({ where: { periodId: latestPeriod.id, axisId: null, subject: { subjectType: "MINISTRY" } }, include: { subject: { include: { ministry: true } } }, orderBy: { totalScore: "desc" } });
    const officialScores = await this.prisma.score.findMany({ where: { periodId: latestPeriod.id, axisId: null, subject: { subjectType: "OFFICIAL" } }, include: { subject: { include: { official: { include: { ministry: true } } } } }, orderBy: { totalScore: "desc" } });
    const statements = await this.prisma.statement.findMany({ orderBy: { statementDate: "desc" }, take: 5, include: { official: true } });
    return { period: latestPeriod, ministryScores, officialScores, statements };
  }
}
