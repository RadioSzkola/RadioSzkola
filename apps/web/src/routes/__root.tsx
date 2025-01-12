import { Outlet, createRootRoute } from "@tanstack/react-router";
import Footer from "../components/footer";
import Navigation from "../components/navigation";
import SignUp from "../ui/signup";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <Navigation />
            <Outlet />
            <Footer />
            <SignUp />
        </>
    );
}
