import { IGDBApiClient } from "@/adapters/igdb/igdb-api-client";
import { IGDBApiAdapterImplementation } from "@/adapters/igdb/igdb-api-adapter-implementation";
import { TokenManager } from "@/utils/token-manager";

export const configureIGDBClient = async () => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const tokenUrl = process.env.ACCESS_TOKEN_API_URL;

  if (!clientId || !clientSecret) {
    throw new Error("Missing IGDB credentials");
  }

  const tokenManager = new TokenManager(clientId, clientSecret, tokenUrl);

  const client = new IGDBApiClient({
    clientId,
    tokenManager,
  });

  return new IGDBApiAdapterImplementation(client);
};
