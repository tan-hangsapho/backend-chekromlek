import APIError from "@post/errors/api-error";
import { StatusCode } from "@post/utils/const";
import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateInput = (schema: ZodSchema) => {
  return (_req: Request, _res: Response, _next: NextFunction) => {
    try {
      console.log(_req.body);
      schema.parse(_req.body);
      _next();
    } catch (error: any | unknown) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.reduce(
          (acc: { [key: string | number]: string }, issue) => {
            acc[issue.path[0]] = issue.message;
            return acc;
          },
          {}
        );

        const formattedErrorString = JSON.stringify(formattedErrors);

        const inputError = new APIError(
          formattedErrorString,
          StatusCode.NotFound
        );
        _next(inputError);
      } else {
        _next(new APIError("Internal Server Error!!", StatusCode.BadRequest));
      }
    }
  };
};
