import { IGDBApiAdapterImplementation } from "@/adapters/igdb/igdb-api-adapter-implementation";
import { GameController } from "@/controllers/game-controller";
import { GameServiceImplementation } from "@/services/game-service-implementation";
import {
  IGDBApiClient,
  IGDBApiClientConfig,
} from "../adapters/igdb/igdb-api-client";
import { TokenManager } from "@/utils/token-manager";

process.loadEnvFile();

export function buildGameController() {
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

  return new GameController(gameService);
}
