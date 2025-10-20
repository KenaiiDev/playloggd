import { NextFunction, Request, Response } from "express";
import { UserServiceImplementation } from "../services/user-service-implementation";
import { httpResponse } from "../utils/http-response";

export class UserController {
  private userService: UserServiceImplementation;

  constructor(userService: UserServiceImplementation) {
    this.userService = userService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.create(req.body);
      return httpResponse.CREATED(res, user);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getById(req.params.id);
      if (!user) {
        return httpResponse.NOT_FOUND(res, "User not found");
      }
      return httpResponse.OK(res, user);
    } catch (error) {
      next(error);
    }
  }

  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getByEmail(req.params.email);
      if (!user) {
        return httpResponse.NOT_FOUND(res, "User not found");
      }
      return httpResponse.OK(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await this.userService.update({
        user: req.params.id,
        data: {
          ...req.body,
        },
      });

      return httpResponse.OK(res, newUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedUser = await this.userService.deleteUser(req.params.id);
      if (!deletedUser) return httpResponse.NOT_FOUND(res, "User not found");
      if (deletedUser) return httpResponse.OK(res, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
