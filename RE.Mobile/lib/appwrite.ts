import {
  Account,
  Avatars,
  Client,
  Databases,
  Models,
  OAuthProvider,
  Query,
} from "react-native-appwrite";
import {
  openAuthSessionAsync,
  WebBrowserAuthSessionResult,
} from "expo-web-browser";
import * as Linking from "expo-linking";

export const config = {
  platform: "com.n3o.realestate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  galleriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

export async function login(): Promise<boolean> {
  try {
    const redirectUri: string = Linking.createURL("/");
    const response: void | URL = account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri,
    );

    if (!response) {
      console.log("LOGIN - Failed to create OAuth2Token.");
      return false;
    }

    const browserResult: WebBrowserAuthSessionResult =
      await openAuthSessionAsync(response.toString(), redirectUri);

    if (browserResult.type != "success") {
      console.log("LOGIN - Failed to open Auth Session.");
      return false;
    }

    const url = new URL(browserResult.url);

    const secret: string | undefined = url.searchParams
      .get("secret")
      ?.toString();
    const userId: string | undefined = url.searchParams
      .get("userId")
      ?.toString();

    if (!secret || !userId) {
      console.log(
        "LOGIN - Failed to get Secret or UserId from created Session.",
      );
      return false;
    }

    const session: Models.Session = await account.createSession(userId, secret);
    if (!session) {
      console.log("LOGIN - Failed to create session.");
      return false;
    }

    return true;
  } catch (error) {
    console.error("LOGIN - " + error);
    return false;
  }
}

export async function logout(): Promise<boolean> {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error("LOGOUT - " + error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const response: Models.User<Models.Preferences> = await account.get();

    if (response.$id) {
      const userAvatar: URL = avatar.getInitials(response.name);

      return {
        ...response,
        avatar: userAvatar.toString(),
      };
    }
  } catch (error) {
    console.error(error);
    console.log("GET USER - " + error);
  }
}

export async function getLatestProperties(): Promise<Models.Document[]> {
  try {
    const result: Models.DocumentList<Models.Document> =
      await databases.listDocuments(
        config.databaseId!,
        config.propertiesCollectionId!,
        [Query.orderAsc("$createdAt"), Query.limit(5)],
      );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}): Promise<Models.Document[]> {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter != "All") {
      buildQuery.push(Query.equal("type", filter));
    }

    if (query) {
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ]),
      );
    }

    if (limit) {
      buildQuery.push(Query.limit(limit));
    }

    const result: Models.DocumentList<Models.Document> =
      await databases.listDocuments(
        config.databaseId!,
        config.propertiesCollectionId!,
        buildQuery,
      );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPropertyById({
  id,
}: {
  id: string;
}): Promise<Models.Document | null> {
  try {
    return await databases.getDocument(
      config.databaseId!,
      config.propertiesCollectionId!,
      id,
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}
