import { Controller, Get, Param } from "@nestjs/common";
import { OfficialsService } from "./officials.service";

@Controller("officials")
export class OfficialsController {
  constructor(private readonly officialsService: OfficialsService) {}

  @Get()
  findAll() {
    return this.officialsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.officialsService.findOne(id);
  }
}
