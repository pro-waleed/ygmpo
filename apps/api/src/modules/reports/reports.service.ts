import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.report.findMany({ include: { period: true, ministry: true, official: true }, orderBy: { publishedAt: "desc" } });
  }

  async findBySlug(slug: string) {
    const report = await this.prisma.report.findUnique({ where: { slug }, include: { period: true, ministry: true, official: true } });
    if (!report) throw new NotFoundException("التقرير غير موجود");
    return report;
  }
}
