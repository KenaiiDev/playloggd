import { Request, Response } from "express";
import { httpResponse } from "@/utils/http-response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

const ERROR_HANDLER = {
  P2002: (res: Response, err: PrismaClientKnownRequestError) => {
    return httpResponse.CONFLICT<PrismaClientKnownRequestError>(
      res,
      err.message,
      err
    );
  },
  P2025: (res: Response, err: PrismaClientKnownRequestError) => {
    return httpResponse.NOT_FOUND(res, err.message);
  },
  ZOD_ERROR: (res: Response, err: ZodError) => {
    return httpResponse.BAD_REQUEST(res, "Error de validación", err.issues);
  },
  defaultError: (res: Response, err: unknown) => {
    const message = "Internal Server Error";
    return httpResponse.INTERNAL_SERVER_ERROR(res, message, err);
  },
};

export const errorHandler = (error: Error, _req: Request, res: Response) => {
  let option: string | undefined;

  console.log({ option });

  if (error instanceof PrismaClientKnownRequestError) {
    option = error.code;
  } else if (error instanceof ZodError) {
    option = "ZOD_ERROR";
  }

  const handler =
    ERROR_HANDLER[option as keyof typeof ERROR_HANDLER] ??
    ERROR_HANDLER.defaultError;

  (handler as (res: Response, err: unknown) => void)(res, error);
};
