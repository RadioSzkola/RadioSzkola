import { createLazyFileRoute } from "@tanstack/react-router";
import Hamburger from "../ui/hamburger";

export const Route = createLazyFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>abc</div>;
}
