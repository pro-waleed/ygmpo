import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async homepage() {
    const period = await this.prisma.evaluationPeriod.findFirst({ orderBy: { startDate: "desc" } });
    const reports = await this.prisma.report.findMany({ where: { publishedAt: { not: null } }, orderBy: { publishedAt: "desc" }, take: 4 });
    return { period, reports };
  }

  methodology() {
    return {
      title: "منهجية مرصد الأداء الحكومي والقيادي",
      sections: [
        "يقيس المرصد أداء الوزارات والوزراء بصورة منفصلة ومتكاملة.",
        "تعتمد المؤشرات الحساسة على أدلة موثقة ومراجعة بشرية وسجل تدقيق.",
        "يُحسب حضور مجلس الوزراء من خلال الاجتماعات المسجلة وحالة الحضور المعتمدة.",
        "يُحسب التواجد داخل اليمن من سجلات زمنية موثقة خلال الفترة التقييمية.",
        "توثق التصريحات والمواقف الوطنية بحسب المصدر والموضوع ومدى الاتساق مع الموقف الرسمي للدولة."
      ]
    };
  }
}
