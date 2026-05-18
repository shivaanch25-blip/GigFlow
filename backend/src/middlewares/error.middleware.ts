import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  const statusCode = (err as any).statusCode || 500;
  const message = (err as any).message || "Internal server error.";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
