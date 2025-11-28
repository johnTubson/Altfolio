import { NextFunction, Request, Response } from "express";

export type AsyncRequestHandler<
  P = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = <
  P = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown
>(
  fn: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>
) => {
  return (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
