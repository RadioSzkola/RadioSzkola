import { Icon } from "@iconify/react";

import "../styles/footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <section className="top">
                <header className="title">
                    <h1>Radiowęzeł LO2</h1>
                </header>
                <ul className="socials">
                    <li>
                        <a
                            href="https://open.spotify.com/user/31sejasvsuyf46kb7c5fwrs74fue?si=8c0f7f67e4554a9e"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icon className="icon" icon="mdi:spotify" />
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
            <div className="spacer"></div>
            <section className="mid">
                <div className="info">
                    <h1>Adres</h1>
                    <ul>
                        <li>
                            II Liceum Ogólnokształcące im. Adama Mickiewicza
                        </li>
                        <li>Kard. S. Wyszyńskiego 3</li>
                        <li>47-400 Racibórz</li>
                    </ul>
                </div>
                <div className="info">
                    <h1>O stronie</h1>
                    <ul>
                        <li>
                            <a href="#nav_menu">Strona główna</a>
                        </li>
                        <li>
                            <a href="#playlista">Playlista</a>
                        </li>
                        <li>
                            <a href="#">Propozycje</a>
                        </li>
                    </ul>
                </div>
                <div className="info">
                    <h1>Kontakt</h1>
                    <ul>
                        <li>
                            <a href="mailto:lo2radiowezel@proton.me">Poczta</a>
                        </li>
                        <li>
                            <a href="#">Instagram</a>
                        </li>
                        <li>
                            <a href="#">TikTok</a>
                        </li>
                    </ul>
                </div>
                <div className="info">
                    <h1>Informacje</h1>
                    <ul>
                        <li>©Radiowęzeł LO2</li>
                        <li>
                            <a href="https://open.spotify.com/playlist/6kG5IPJjb2xyu0mouhET7B?si=bf71003228344627">
                                Playlista Spotify
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://www.instagram.com/mikusshepard/"
                            >
                                Pomysłodawca: Mikus
                            </a>
                        </li>
                        <li>
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
            <div className="spacer"></div>
            <section className="bottom">
                <span className="copyright">
                    Copyright ©2024 <a>Radiowęzeł LO2</a>
                </span>
                <span className="policy-terms">Wszelkie prawa zastrzeżone</span>
            </section>
        </footer>
    );
}
