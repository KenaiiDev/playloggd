import type { Response } from "express";

interface ResponseJsonBase {
  status: number;
  statusMsg: string;
}

interface ResponseJsonData<T> extends ResponseJsonBase {
  data: T;
}

interface ResponseJsonMessage extends ResponseJsonBase {
  message: string;
}

interface ResponseJsonMessageError<ErrorType = string>
  extends ResponseJsonBase {
  error: ErrorType;
  message: string;
}

type Send<DataType, ResType = Response> = (
  body?: ResponseJsonData<DataType>
) => ResType;
type SendMsg<ResType = Response> = (body?: ResponseJsonMessage) => ResType;
type SendMsgError<ErrorType = string, ResType = Response> = (
  body?: ResponseJsonMessageError<ErrorType>
) => ResType;

export interface CustomResponseData<DataType> extends Response {
  json: Send<DataType, this>;
}

export interface CustomResponseMessage extends Response {
  json: SendMsg<this>;
}

export interface CustomResponseMessageError<ErrorType = string>
  extends Response {
  json: SendMsgError<ErrorType, this>;
}
