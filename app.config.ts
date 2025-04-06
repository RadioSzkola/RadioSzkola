export default defineAppConfig({
    ui: {
        colors: {
            primary: "red",
            secondary: "green",
            error: "red",
            info: "blue",
            neutral: "neutral",
            success: "green",
            warning: "orange",
        },
        button: {
            slots: {
                base: "rounded-none border-shadow-sm",
            },
            variants: {
                size: {
                    xs: {
                        base: "border-shadow-sm",
                    },
                    sm: {
                        base: "border-shadow-sm",
                    },
                    md: {
                        base: "border-shadow-sm",
                    },
                    lg: {
                        base: "border-shadow-md",
                    },
                    xl: {
                        base: "border-shadow-md",
                    },
                },
            },
        },
        input: {
            slots: {
                base: "rounded-none",
            },
            variants: {
                size: {
                    xs: {
                        base: "border-shadow-sm",
                    },
                    sm: {
                        base: "border-shadow-sm",
                    },
                    md: {
                        base: "border-shadow-sm",
                    },
                    lg: {
                        base: "border-shadow-md",
                    },
                    xl: {
                        base: "border-shadow-md",
                    },
                },
            },
        },
        modal: {
            slots: {
                content: "rounded-none border-shadow-lg",
                overlay: "bg-black/25 backdrop-blur-sm",
            },
        },
    },
});
