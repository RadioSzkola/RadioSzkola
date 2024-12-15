import { Outlet, createRootRoute } from "@tanstack/react-router";
import Footer from "../components/footer";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <Outlet />
            <Footer />
        </>
    );
}
