export const SERVER_HOST =
    import.meta.env.MODE === "development"
        ? "http://localhost:8000"
        : "http://159.89.100.139:8000";
