import { Controller, Get, Param } from "@nestjs/common";
import { MinistriesService } from "./ministries.service";

@Controller("ministries")
export class MinistriesController {
  constructor(private readonly ministriesService: MinistriesService) {}

  @Get()
  findAll() {
    return this.ministriesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ministriesService.findOne(id);
  }
}
