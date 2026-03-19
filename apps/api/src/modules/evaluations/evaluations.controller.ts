import { Controller, Get } from "@nestjs/common";
import { EvaluationsService } from "./evaluations.service";

@Controller("evaluations")
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Get("axes")
  getAxes() {
    return this.evaluationsService.getAxes();
  }

  @Get("periods")
  getPeriods() {
    return this.evaluationsService.getPeriods();
  }

  @Get("scoreboard")
  getScoreboard() {
    return this.evaluationsService.getScoreboard();
  }
}
