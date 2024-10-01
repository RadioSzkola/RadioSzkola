import { Session, User } from "@rs/shared/models";
import type { Env } from "hono";

export interface ApiContext extends Env {
    Variables: {
        user: User;
        session: Session;
    };
}
