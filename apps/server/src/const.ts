loadEnvFile(".env");

export const SERVER_PORT = process.env.SERVER_PORT as string;
export const SERVER_URL = process.env.SERVER_URL as string;

export const WEB_APP_URL = process.env.WEB_APP_URL as string;

export const MODE = process.env.MODE as "development" | "production";

export const DATABASE_PATH = process.env.DATABASE_PATH as string;
export const DATABASE_MIGRATIONS_FOLDER = process.env
    .DATABASE_MIGRATIONS_FOLDER as string;

export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string;
export const SPOTIFY_CLIENT_SECRET = process.env
    .SPOTIFY_CLIENT_SECRET as string;
export const SPOTIFY_REDIRECT_URI = SERVER_URL + "/v1/spotify/callback";
export const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
export const SPOTIFY_WEB_REDIRECT_URL = WEB_APP_URL;

export const CORS_ALLOWED_ORIGINS = [WEB_APP_URL];

export const CRYPTO_PEPPER = process.env.CRYPTO_PEPPER as string;
export const CRYPTO_ROOT_USER_PASSWORD = process.env
    .CRYPTO_ROOT_USER_PASSWORD as string;

export function loadEnvFile(path: string) {
    process.loadEnvFile(path);
    validateEnvVariables();
}

export function validateEnvVariables() {
    const requiredEnvVars = [
        "SERVER_PORT",
        "SERVER_URL",

        "WEB_APP_URL",

        "MODE",

        "DATABASE_PATH",
        "DATABASE_MIGRATIONS_FOLDER",

        "SPOTIFY_CLIENT_ID",
        "SPOTIFY_CLIENT_SECRET",

        "CRYPTO_PEPPER",
        "CRYPTO_ROOT_USER_PASSWORD",
    ];

    const missingEnvVars = requiredEnvVars.filter(
        envVar => !process.env[envVar],
    );

    if (missingEnvVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingEnvVars.join(", ")}`,
        );
    }

    if (
        process.env.MODE !== "development" &&
        process.env.MODE !== "production"
    ) {
        throw new Error(
            `Invalid MODE value: ${process.env.MODE}. Allowed values are "development" and "production".`,
        );
    }
}
