# RadioSzkola `@rs/shared` package

This package is shared between all the other packages and apps.

# Scripts

-   `dev` - watches and builds the package
-   `build` - builds the app

# Files and directories

-   `src/schemas` - the **drizzle** db schemas and relations
-   `/src/models` - the data models, their types and **zod** schemas

All the other files in the `/src` are to become folders when their complexity grows enough
that there is a need to brake them up into smaller modules.
