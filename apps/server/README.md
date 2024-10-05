# RadioSzkola monolith server

# Scripts

-   `dev` - watches and runs the app
-   `build` - builds the app
-   `migrate:generate` - generates sql migration schemas
-   `migrate:run` - runs sql migration schemas on the local sqlite db
-   `test:unit` - runs unit tests in `/tests`

# Files and directories

-   `/tests` - unit testing, flat directory structure
-   `/migrations` - drizzle sqlite migration files and metadata
-   `/api` - contains the http/rest api layer
-   `/src/middleware` - containts middlewares for the api layer

All the other files in the `/src` are to become folders when their complexity grows enough
that there is a need to brake them up into smaller modules.
