import {
  CustomResponseData,
  CustomResponseMessage,
  CustomResponseMessageError,
} from "./types";

import { HttpStatus } from "./constants";

export const httpResponse = {
  OK: <DataType>(res: CustomResponseData<DataType>, data: DataType) => {
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      statusMsg: "Success",
      data,
    });
  },
  CREATED: <DataType>(res: CustomResponseData<DataType>, data: DataType) => {
    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      statusMsg: "Created",
      data,
    });
  },
  NO_CONTENT: (res: CustomResponseMessage) => {
    return res.status(HttpStatus.NO_CONTENT).send();
  },
  BAD_REQUEST: <ErrorType>(
    res: CustomResponseMessageError<ErrorType>,
    message: string,
    errorData: ErrorType
  ) => {
    return res.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      statusMsg: "Bad Request",
      message,
      error: errorData,
    });
  },
  NOT_FOUND: (res: CustomResponseMessage, message: string) => {
    return res.status(HttpStatus.NOT_FOUND).json({
      status: HttpStatus.NOT_FOUND,
      statusMsg: "Not Found",
      message,
    });
  },
  UNPROCESSABLE_ENTITY: <ErrorType>(
    res: CustomResponseMessageError<ErrorType>,
    message: string,
    errorData: ErrorType
  ) => {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      statusMsg: "Unprocessable Entity",
      message,
      error: errorData,
    });
  },

  CONFLICT: <ErrorType>(
    res: CustomResponseMessageError<ErrorType>,
    message: string,
    error: ErrorType
  ) => {
    return res.status(HttpStatus.CONFLICT).json({
      status: HttpStatus.CONFLICT,
      statusMsg: "Conflict",
      message,
      error,
    });
  },

  INTERNAL_SERVER_ERROR: <ErrorType>(
    res: CustomResponseMessageError<ErrorType>,
    message: string,
    error: ErrorType
  ) => {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      statusMsg: "Internal Server Error",
      message,
      error: error,
    });
  },
  UNAUTHORIZED: (res: CustomResponseMessage, message: string) => {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      status: HttpStatus.UNAUTHORIZED,
      statusMsg: "Unauthorized",
      message,
    });
  },
};
