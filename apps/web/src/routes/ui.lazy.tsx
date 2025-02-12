import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "../ui/button";

export const Route = createLazyFileRoute("/ui")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
            <Button size="md" variant="neutral" animated={true}>
                Lubię placki
            </Button>
            <Button size="lg" variant="inverted" animated={true}>
                Lubię placki
            </Button>
            <Button size="md" variant="primary" animated={true}>
                Lubię placki
            </Button>
            <Button size="sm" variant="secondary" animated={true}>
                Lubię placki
            </Button>
        </div>
    );
}
