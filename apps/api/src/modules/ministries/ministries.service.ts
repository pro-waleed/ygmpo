import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class MinistriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.ministry.findMany({
      include: { officials: true, subject: { include: { scores: { where: { axisId: null }, orderBy: { createdAt: "desc" }, take: 1 } } } },
      orderBy: { nameAr: "asc" }
    });
  }

  findOne(id: string) {
    return this.prisma.ministry.findUnique({
      where: { id },
      include: { officials: true, reports: true, subject: { include: { scores: true, indicatorEntries: { include: { indicator: { include: { axis: true } } } } } } }
    });
  }
}
