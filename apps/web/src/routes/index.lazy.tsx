import { createLazyFileRoute } from "@tanstack/react-router";
import Hamburger from "../ui/hamburger";
import styles from "../styles/index-route.module.css";
import ImgSpeaker from "../img/speaker.png";

export const Route = createLazyFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <main className={styles.mainWraper}>
                <img
                    src={ImgSpeaker}
                    alt="głośnik"
                    className={styles.mainImg}
                />
                <div className={styles.mainContent}>
                    <h1 className={styles.mainContentHeader}>Radiowęzeł</h1>
                    <p className={styles.mainContentParagraph}>
                        Radiowęzeł LO2 to oficjalna strona szkolnego radiowęzła
                        Liceum Ogólnokształcącego Nr 2 w Raciborzu. Dziel się
                        propozycjami, polub lubiane utwory oraz steruj muzyką na
                        przerwach!
                    </p>
                    <div className={styles.mainContentCTA}>
                        <a
                            href="#playlista"
                            className={styles.mainContentCTAPlaylist}
                        >
                            playlista
                        </a>
                        <a
                            href="#"
                            className={styles.mainContentCTAPropositions}
                        >
                            Propozycje (Wkrótce)
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
