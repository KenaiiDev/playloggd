import { NextFunction, Request, Response } from "express";
import {
  register,
  getUsers,
  getUsersByEmail,
  deleteAccount,
  updateProfile,
} from "@playloggd/domain";
import { httpResponse } from "../utils/http-response";
import { UserServiceImplementation } from "@/services/user-service-implementation";
import { AuthServiceImplementation } from "@/services/auth-service-implementation";

export class UserController {
  private userService: UserServiceImplementation;
  private authService: AuthServiceImplementation;

  constructor(
    userService: UserServiceImplementation,
    authService: AuthServiceImplementation
  ) {
    this.userService = userService;
    this.authService = authService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await register({
        dependencies: {
          userService: this.userService,
          authService: this.authService,
        },
        payload: req.body,
      });

      if (result instanceof Error) {
        return httpResponse.BAD_REQUEST(res, result.message, { error: result });
      }

      return httpResponse.CREATED(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getUsers({
        dependencies: { userService: this.userService },
        payload: { id: req.params.id },
      });

      if (!result) {
        return httpResponse.NOT_FOUND(res, "No user found");
      }

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getUsersByEmail({
        dependencies: { userService: this.userService },
        payload: { email: req.params.email },
      });

      if (result instanceof Error) {
        return httpResponse.NOT_FOUND(res, result.message);
      }

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deleteAccount({
        dependencies: {
          userService: this.userService,
          authService: this.authService,
        },
        payload: {
          userId: req.params.id,
          password: req.body.password,
        },
      });

      if (result instanceof Error) {
        return httpResponse.BAD_REQUEST(res, result.message, { error: result });
      }

      return httpResponse.OK(res, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await updateProfile({
        dependencies: { userService: this.userService },
        payload: {
          user: req.params.id,
          data: req.body,
        },
      });

      if (result instanceof Error) {
        return httpResponse.BAD_REQUEST(res, result.message, { error: result });
      }

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }
}
