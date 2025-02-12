import { createLazyFileRoute } from "@tanstack/react-router";
import SignupForm from "../components/signup-form";

export const Route = createLazyFileRoute("/ui")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <SignupForm />
        </div>
    );
}
