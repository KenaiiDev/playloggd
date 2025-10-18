import { GameReviewService, UserService } from "@/services";

interface GetUserReviewProps {
  dependencies: {
    gameReviewService: GameReviewService;
    userService: UserService;
  };
  payload: {
    userId: string;
  };
}

export async function getUserReviews({
  dependencies,
  payload,
}: GetUserReviewProps) {
  if (!payload.userId) return new Error("User id is required");

  const userFound = await dependencies.userService.getById(payload.userId);
  if (!userFound) return new Error("No user found");

  const result = await dependencies.gameReviewService.getUserReviews(
    payload.userId
  );

  return result;
}
