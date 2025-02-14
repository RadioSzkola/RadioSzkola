import { createFileRoute } from "@tanstack/react-router";
import Button from "../../ui/button";
import { SERVER_HOST } from "../../const";

export const Route = createFileRoute("/admin/spotify")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <a href={SERVER_HOST + "/v1/spotify/init"}>
                <Button size="md" variant="neutral">
                    Połącz się ze spotify
                </Button>
            </a>
        </div>
    );
}
