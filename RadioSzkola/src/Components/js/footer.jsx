import '/src/Components/css/footer.css';

const Footer = () => {
    return (
        <footer id="info">
            <div className="FooterContainer">
                <div className="FooterUpperContainer">
                    <div className="FooterSpotifyLink">
                        Radiowęzeł LO2
                        <a href="https://open.spotify.com/user/31sejasvsuyf46kb7c5fwrs74fue?si=8c0f7f67e4554a9e"><i className="ri-spotify-fill"></i></a>
                    </div>
                    <div className="FooterSchoolLinks">
                        <a href="https://www.facebook.com/lo2rac"><i className="ri-facebook-fill"></i></a>
                        <a href="https://twitter.com/lo2rac/"><i className="ri-twitter-fill"></i></a>
                        <a href="https://www.instagram.com/2lo_raciborz/"><i className="ri-instagram-line"></i></a>
                        <a href="https://www.tiktok.com/@2lo_raciborz"><i className="bi bi-tiktok"></i></a>
                    </div>
                </div>
                <div className="FooterLowerContainer">
                    <ul className="FooterInfoBox">
                        <li className="FooterInfoBoxHeader">O stronie</li>
                        <li><a href="#nav_menu">Strona główna</a></li>
                        <li><a href="#playlista">Playlista</a></li>
                        <li><a href="#">Propozycje</a></li>
                    </ul>
                    <ul className="FooterInfoBox">
                        <li className="FooterInfoBoxHeader">Adres</li>
                        <li>II Liceum Ogólnokształcące im. Adama Mickiewicza</li>
                        <li>Kard. S. Wyszyńskiego 3</li>
                        <li>47-400 Racibórz</li>
                    </ul>
                    <ul className="FooterInfoBox">
                        <li className="FooterInfoBoxHeader">Kontakt</li>
                        <li><a href="mailto:lo2radiowezel@proton.me">Poczta</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">TikTok</a></li>
                    </ul>
                    <ul className="FooterInfoBox">
                        <li className="FooterInfoBoxHeader">Informacje</li>
                        <li>©Radiowęzeł LO2</li>
                        <li><a href="https://open.spotify.com/playlist/6kG5IPJjb2xyu0mouhET7B?si=bf71003228344627">Playlista Spotify</a></li>
                        <li><a target="_blank" href="https://www.instagram.com/mikusshepard/">Pomysłodawca: Mikus</a></li>
                        <li><a target="_blank" href="https://www.instagram.com/mikusshepard/">Wykonawca: Mikus</a></li>
                    </ul>
                </div>
            </div>
            <div className="LowerFooter">
                <div className="LowerFooterText">
                    <span className="LowerFooterCopyright">Copyright ©2024 <a>Radiowęzeł LO2</a></span>
                    <span className="LowerFooterPolicyTerms">
                        Wszelkie prawa zastrzeżone
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer;