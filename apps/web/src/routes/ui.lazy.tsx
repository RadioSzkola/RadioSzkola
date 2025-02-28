import { createLazyFileRoute } from "@tanstack/react-router";
import TextInput from "../ui/text-input";

export const Route = createLazyFileRoute("/ui")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <TextInput label="name" />
            <TextInput label="name" variant="error" />
            <TextInput label="name" variant="valid" />
        </div>
    );
}
