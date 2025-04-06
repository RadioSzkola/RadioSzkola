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
    toast: {
      slots: {
        root: "rounded-none border-shadow-md",
        title: "text-black",
        description: "text-black font-mono text-lg",
      },
      variants: {
        color: {
          neutral: {
            root: "bg-amber-50 text-black",
            progress: "bg-black",
          },
          error: {
            root: "bg-red-500 text-black",
            progress: "bg-black",
          },
          info: {
            root: "bg-sky-500 text-black",
            progress: "bg-black",
          },
          success: {
            root: "bg-green-400 text-black",
            progress: "bg-black",
          },
        },
      },
    },
    badge: {
      slots: {
        base: "rounded-000 border-2 border-black",
      },
    },
  },
});
