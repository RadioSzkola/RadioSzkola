export const SERVER_HOST =
    import.meta.env.MODE === "development"
        ? "http://localhost:8000"
        : "http://localhost:8000";
