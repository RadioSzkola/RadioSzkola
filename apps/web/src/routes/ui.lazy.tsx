import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "../ui/button";
import SearchBar from "../ui/search-bar";
import { useState } from "react";
import TextInput from "../ui/text-input";
import EmailInput from "../ui/email-input";
import PasswordInput from "../ui/password-input";

export const Route = createLazyFileRoute("/ui")({
    component: RouteComponent,
});

function RouteComponent() {
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
                    searchTerm={"album"}
                    searchCategory={"album"}
                    searchCategories={[
                        { text: "album", value: "utwor" },
                        { text: "utwor", value: "album" },
                    ]}
                />
                <TextInput
                    id="name"
                    value=""
                    label="name"
                    size="md"
                    variant="neutral"
                />
                <EmailInput
                    id="email"
                    value=""
                    label="email"
                    size="md"
                    variant="neutral"
                />
                <PasswordInput
                    id="password"
                    value=""
                    label="password"
                    size="md"
                    variant="neutral"
                />
            </div>
        </div>
    );
}
