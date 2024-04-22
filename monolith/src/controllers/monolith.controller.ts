import { Controller, Get, Route, SuccessResponse, Tags } from "tsoa";
@Route("/")
@Tags("monolith")
export class MonolithController {
  @SuccessResponse("OK")
  @Get("/")
  public async ShowResponse(): Promise<any> {
    return "OK";
  }
}
