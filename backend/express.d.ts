import { User } from "@clerk/clerk-sdk-node"; // Adjust the import based on your actual User type

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
