import { Get, Route, SuccessResponse } from "tsoa";
import { StatusCode } from "../utils/@const";

@Route("/gateway-health")
export class Health {
  @SuccessResponse(StatusCode.OK, "Success")
  @Get("/")
  public async checkHealth() {
    return { message: "API Gateway service is healthy and OK." };
  }
}
