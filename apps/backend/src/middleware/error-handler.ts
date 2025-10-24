import { Request, Response } from "express";
import { httpResponse } from "@/utils/http-response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import {
  ConflictError,
  PasswordValidationError,
  UnauthorizedError,
  ValidationError,
} from "@playloggd/domain";

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
    return httpResponse.BAD_REQUEST(res, "ValidationError", err.issues);
  },
  PasswordValidationError: (res: Response, err: PasswordValidationError) => {
    return httpResponse.UNAUTHORIZED(res, err.message);
  },
  ValidationError: (res: Response, err: ValidationError) => {
    return httpResponse.BAD_REQUEST(res, err.name, err.message);
  },
  ConflictError: (res: Response, err: ConflictError) => {
    return httpResponse.CONFLICT(res, err.name, err.message);
  },
  UnauthorizedError: (res: Response, err: UnauthorizedError) => {
    return httpResponse.UNAUTHORIZED(res, err.message);
  },
  defaultError: (res: Response, err: unknown) => {
    const message = "Internal Server Error";
    return httpResponse.INTERNAL_SERVER_ERROR(res, message, err);
  },
};

export const errorHandler = (error: Error, _req: Request, res: Response) => {
  let option: string | undefined;

  if (error instanceof PrismaClientKnownRequestError) {
    option = error.code;
  } else if (error instanceof ZodError) {
    option = "ZOD_ERROR";
  }

  switch (true) {
    case error instanceof PrismaClientKnownRequestError:
      option = error.code;
      break;

    case error instanceof ZodError:
      option = "ZOD_ERROR";
      break;

    case error instanceof PasswordValidationError:
      option = "PasswordValidationError";
      break;

    case error instanceof ValidationError:
      option = "ValidationError";
      break;

    case error instanceof ConflictError:
      option = "ConflictError";
      break;

    case error instanceof UnauthorizedError:
      option = "UnauthorizedError";
      break;

    default:
      option = "defaultError";
      break;
  }

  const handler =
    ERROR_HANDLER[option as keyof typeof ERROR_HANDLER] ??
    ERROR_HANDLER.defaultError;

  (handler as (res: Response, err: unknown) => void)(res, error);
};
