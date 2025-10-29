import { NextFunction, Request, Response } from "express";
import {
  changePassword,
  login,
  refreshToken,
  ValidationError,
} from "@playloggd/domain";
import { AuthServiceImplementation } from "@/services/auth-service-implementation";
import { UserServiceImplementation } from "@/services/user-service-implementation";
import { httpResponse } from "@/utils/http-response";

export class AuthController {
  private authService: AuthServiceImplementation;
  private userService: UserServiceImplementation;

  constructor(
    userService: UserServiceImplementation,
    authService: AuthServiceImplementation
  ) {
    this.userService = userService;
    this.authService = authService;
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await login({
        dependencies: {
          authService: this.authService,
          userService: this.userService,
        },
        payload: req.body,
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.id !== req.params.id) {
        return next(new ValidationError("Unauthorized!"));
      }
      const result = await changePassword({
        dependencies: {
          authService: this.authService,
        },
        payload: {
          userId: req.params.id,
          currentPassword: req.body.currentPassword,
          newPassword: req.body.newPassword,
        },
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await refreshToken({
        dependencies: {
          authService: this.authService,
        },
        payload: req.body,
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }
}
