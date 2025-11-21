import { BcryptAdapter } from "@/adapters/bcrypt-adapter";
import { IGDBApiAdapterImplementation } from "@/adapters/igdb/igdb-api-adapter-implementation";
import {
  IGDBApiClientConfig,
  IGDBApiClient,
} from "@/adapters/igdb/igdb-api-client";
import { GameReviewController } from "@/controllers/game-review-controller";
import { GameReviewServiceImplementation } from "@/services/game-review-service-implementation";
import { GameServiceImplementation } from "@/services/game-service-implementation";
import { UserServiceImplementation } from "@/services/user-service-implementation";
import { TokenManager } from "@/utils/token-manager";
import { PrismaClient } from "@prisma/client";

export function buildGameReviewController() {
  const prisma = new PrismaClient();

  const clientId = process.env.CLIENT_ID!;
  const clientSecret = process.env.CLIENT_SECRET!;
  const tokenUrl = process.env.ACCESS_TOKEN_API_URL!;
  const baseUrl = process.env.GAMES_API_URL!;

  const tokenManager = new TokenManager(clientId, clientSecret, tokenUrl);

  const igdbApiClientConfig: IGDBApiClientConfig = {
    clientId: clientId,
    baseURL: baseUrl,
    tokenManager: tokenManager,
  };

  const igdbApiClient = new IGDBApiClient(igdbApiClientConfig);
  const igdbApiAdapter = new IGDBApiAdapterImplementation(igdbApiClient);
  const gameService = new GameServiceImplementation(igdbApiAdapter);

  const passwordHasher = new BcryptAdapter();
  const userService = new UserServiceImplementation(prisma, passwordHasher);

  const gameReviewService = new GameReviewServiceImplementation(prisma);

  return new GameReviewController(gameReviewService, gameService, userService);
}
