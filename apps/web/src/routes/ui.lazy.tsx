import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "../ui/button";
import SearchBar from "../ui/search-bar";
import { useState } from "react";

export const Route = createLazyFileRoute("/ui")({
    component: RouteComponent,
});

function RouteComponent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("album");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", gap: "1rem", flexDirection: "row" }}>
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
            <div style={{ display: "flex", gap: "1rem", flexDirection: "row" }}>
                <SearchBar
                    searchTerm={searchTerm}
                    searchCategory={searchCategory}
                    searchCategories={[
                        { text: "album", value: "utwor" },
                        { text: "utwor", value: "album" },
                    ]}
                    onInputChange={ev => setSearchTerm(ev.currentTarget.value)}
                    onSelectChange={ev =>
                        setSearchCategory(ev.currentTarget.value)
                    }
                />
            </div>
        </div>
    );
}
