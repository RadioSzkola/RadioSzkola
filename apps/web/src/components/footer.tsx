import { Icon } from "@iconify/react";

import styles from "../styles/footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.Footer}>
            <section className={styles.FooterTop}>
                <header className={styles.FooterTopHeader}>
                    <h1>Radiowęzeł LO2</h1>
                </header>
                <ul className={styles.FooterTopSocials}>
                    <li>
                        <a
                            href="https://open.spotify.com/user/31sejasvsuyf46kb7c5fwrs74fue?si=8c0f7f67e4554a9e"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icon icon="mdi:spotify" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.facebook.com/lo2rac/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icon
                                className="icon"
                                icon="ic:baseline-facebook"
                            />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://twitter.com/lo2rac/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icon className="icon" icon="prime:twitter" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.instagram.com/2lo_raciborz/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icon className="icon" icon="hugeicons:instagram" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.tiktok.com/@2lo_raciborz/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icon className="icon" icon="ic:baseline-tiktok" />
                        </a>
                    </li>
                </ul>
            </section>
            <div className={styles.FooterSpacer}></div>
            <section className={styles.FooterBody}>
                <div className={styles.FooterBodyInfo}>
                    <h1 className={styles.FooterBodyInfoHeader}>Adres</h1>
                    <ul>
                        <li>
                            II Liceum Ogólnokształcące im. Adama Mickiewicza
                        </li>
                        <li>Kard. S. Wyszyńskiego 3</li>
                        <li>47-400 Racibórz</li>
                    </ul>
                </div>
                <div className={styles.FooterBodyInfo}>
                    <h1 className={styles.FooterBodyInfoHeader}>O stronie</h1>
                    <ul>
                        <li className={styles.FooterBodyInfoLink}>
                            <a href="#nav_menu">Strona główna</a>
                        </li>
                        <li className={styles.FooterBodyInfoLink}>
                            <a href="#playlista">Playlista</a>
                        </li>
                        <li className={styles.FooterBodyInfoLink}>
                            <a href="#">Propozycje</a>
                        </li>
                    </ul>
                </div>
                <div className={styles.FooterBodyInfo}>
                    <h1 className={styles.FooterBodyInfoHeader}>Kontakt</h1>
                    <ul>
                        <li className={styles.FooterBodyInfoLink}>
                            <a href="mailto:lo2radiowezel@proton.me">Poczta</a>
                        </li>
                        <li className={styles.FooterBodyInfoLink}>
                            <a href="#">Instagram</a>
                        </li>
                        <li className={styles.FooterBodyInfoLink}>
                            <a href="#">TikTok</a>
                        </li>
                    </ul>
                </div>
                <div className={styles.FooterBodyInfo}>
                    <h1 className={styles.FooterBodyInfoHeader}>Informacje</h1>
                    <ul>
                        <li>©Radiowęzeł LO2</li>
                        <li className={styles.FooterBodyInfoLink}>
                            <a href="https://open.spotify.com/playlist/6kG5IPJjb2xyu0mouhET7B?si=bf71003228344627">
                                Playlista Spotify
                            </a>
                        </li>
                        <li className={styles.FooterBodyInfoLink}>
                            <a
                                target="_blank"
                                href="https://www.instagram.com/mikusshepard/"
                            >
                                Pomysłodawca: Mikus
                            </a>
                        </li>
                        <li className={styles.FooterBodyInfoLink}>
                            <a
                                target="_blank"
                                href="https://www.instagram.com/mikusshepard/"
                            >
                                Wykonawca: Mikus
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
            <div className={styles.FooterSpacer}></div>
            <section className={styles.FooterBottom}>
                <span className={styles.FooterBottomCopyright}>
                    Copyright ©2024 <a>Radiowęzeł LO2</a>
                </span>
                <span className={styles.FooterBottomPolicyTerms}>
                    Wszelkie prawa zastrzeżone
                </span>
            </section>
        </footer>
    );
}
