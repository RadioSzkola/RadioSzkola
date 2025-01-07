import { createLazyFileRoute } from "@tanstack/react-router";
import Hamburger from "../ui/hamburger";
import styles from "../styles/index-route.module.css";
import ImgSpeaker from "../img/speaker.png";
import { Icon } from "@iconify/react/dist/iconify.js";

export const Route = createLazyFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className={styles.indexRoute}>
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
                    <div className={styles.mainContentCTAWraper}>
                        <a
                            href="#playlista"
                            className={`
                                ${styles.mainContentCTAPlaylist}
                                ${styles.mainContentCTA}
                            `}
                        >
                            Playlista
                            <Icon
                                className={styles.mainContentCTAIcon}
                                icon="fluent:arrow-down-12-filled"
                            />
                        </a>
                        <a
                            href="#"
                            className={`
                                ${styles.mainContentCTAPropositions}
                                ${styles.mainContentCTA}
                            `}
                        >
                            Propozycje (Wkrótce)
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
