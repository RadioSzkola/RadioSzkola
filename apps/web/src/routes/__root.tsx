import { Outlet, createRootRoute } from "@tanstack/react-router";
import Footer from "../components/footer";
import Navigation from "../components/navigation";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <Navigation />
            <Outlet />
            <Footer />
        </>
    );
}
