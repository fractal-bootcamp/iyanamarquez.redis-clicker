import "dotenv/config"; // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
import { clerkClient, LooseAuthProp } from "@clerk/clerk-sdk-node";
import { NextFunction, Request, Response } from "express";

const clerkAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as Request & LooseAuthProp).auth?.userId;
  if (!userId) {
    return next(new Error("User ID is null"));
  }
  const clerkUser = await clerkClient.users.getUser(userId);

  if (!clerkUser) {
    return next(new Error("User not found"));
  }

  req.user = clerkUser;

  next();
};

export default clerkAuthMiddleware;
