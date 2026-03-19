import { Controller, Get } from "@nestjs/common";
import { PublicService } from "./public.service";

@Controller("public")
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get("home")
  home() {
    return this.publicService.homepage();
  }

  @Get("methodology")
  methodology() {
    return this.publicService.methodology();
  }
}
