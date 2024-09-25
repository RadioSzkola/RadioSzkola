import { useState, useEffect } from 'react';
import SearchBar from './js/SearchBar.jsx';
import { getElements } from './js/axios.jsx'
import ListPage from './js/songsWithPagination.jsx';
import BackToTopButton from './js/backToTop.jsx';
import {LastFmData} from "./js/spotifyAPI.jsx";
import LoginForm from './js/login.jsx';
import Notification from './js/notification.jsx';
import { checkIDValidity } from './js/IDChecker.jsx';
import MainSection from './js/mainsection.jsx';
import Footer from './js/footer.jsx';
import './js/api.jsx';
import './css/themeChanger.css';
import './css/navigation.css';
import './css/ListPage.css';

function App(){
    const [elements, setElements] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [pageNumber, setPageNumber] = useState(0);
    const [isUserIDValid, setIsUserIDValid] = useState(false);
    const [userID, setUserID] = useState('');
    const [notifications, setNotifications] = useState([]);

    const themeChange = () => {
        let elements = document.querySelectorAll('*')
        let button = document.querySelector('#theme')
        elements.forEach(element => {
            if (button.checked === true) {
                element.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark')
            } else {
                element.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light')
            }
        })
    }
    
    const toggleMenu = () => {
        const navId = document.querySelector(".NavMenu")
        navId.classList.add("NavMenuShow");
    };
    
    const closeMenu = () => {
        const navId = document.querySelector(".NavMenu")
        navId.classList.remove("NavMenuShow");
    };
    
    const handleLoginShow = () => {
        const logId = document.querySelector(".LoginCentralizingContainer");
        logId.classList.remove("LoginHidden");
    };

    const handleLogOut = () => {
        localStorage.removeItem('ID');
        setNotifications((prev) => [...prev, { message: "Wylogowano pomyślnie.", type: 'success' }]);
        setUserID('');
        setIsUserIDValid(false);
    }

    useEffect(() => {
        const storedID = localStorage.getItem('ID');
        if (storedID) {
            setUserID(storedID);
        }

        const interval = setInterval(() => {
            const currentID = localStorage.getItem('ID');
            if (currentID !== userID) {
                setUserID(currentID);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [userID]);

    useEffect(() => {
        const validateUserID = async () => {
            if (userID) {
                const valid = await checkIDValidity(userID);
                setIsUserIDValid(valid);
            }
        };

        validateUserID();
    }, [userID]);

    useEffect(() => {
        getElements().then(json => {
            setElements(json)
            return json
        }).then(json => {
            setSearchResults(json)
            setLoaded(true)
        })
    }, []);

    useEffect(() => {
        if (searchResults.length === 0) {
            setPageNumber(1);
        }
    }, [searchResults]);

    useEffect(() => {
        if (pageNumber === 1) {
            setPageNumber(prevPage => {
            if (prevPage >= Math.ceil(searchResults.length / 9)) {
                return 0;
            } else {
                return prevPage;
            }
            });
        }
    }, [pageNumber, searchResults.length]);
    
    const handleCloseNotification = (index) => {
        setNotifications((prev) => prev.filter((_, i) => i !== index));
    };
    
    return (
        <div>
            <div className="bg"></div>
            <BackToTopButton />
            <LastFmData isLogged={isUserIDValid} userLoggedID={userID}/>
            <LoginForm />
            <header className="MainHeader MainHeaderAddon">
                <nav className="NavContainer">
                    <a href="./index.html"><div className="NavLogo"></div></a>
                    <div className="NavMenu" id="nav_menu">
                        <div>
                            <button className="NavCloseButton" id="close_btn" onClick={closeMenu}>
                                <i className="ri-close-fill"></i>
                            </button>
                            <label htmlFor="theme" className="NavThemeChangeButton">
                                <input type="checkbox" id="theme" onClick={themeChange} /> 
                                <span className="NavThemeChangeBall"></span>
                                <i className="ri-sun-line NavThemeChangeSun"></i>
                                <i className="ri-moon-line NavThemeChangeMoon"></i>
                            </label>
                        </div>
                        <ul className="NavMenuList">
                
                            <li className="NavMenuListItem">
                                <a href="#playlista" className="NavMenuListItemLink">playlista</a>
                            </li>
                            {/* <li className="NavMenuListItem">
                                <a href="#" className="NavMenuListItemLink">propozycje (wkrótce)</a>
                            </li> */}
                            <li className="NavMenuListItem">
                                <a href="#info" className="NavMenuListItemLink">informacje</a>
                            </li>
                            <li className="NavMenuListItem">
                                <a href="http://2loraciborz.pl/" className="NavMenuListItemLink">szkoła</a>
                            </li>
                            <li className="NavMenuListItem">
                                {isUserIDValid ? (<a onClick={handleLogOut} className="NavMenuListItemLink">wyloguj się</a>) : (<a className="NavMenuListItemLink" onClick={handleLoginShow}>zaloguj się</a>)}
                            </li>
                        </ul>
                    </div>

                    <button className="NavMenuToggleButton" id="toggle_btn" onClick={toggleMenu}>
                        <i className="ri-menu-line"></i>
                    </button>
                </nav>
            </header>
            <MainSection />
            <section className="PlaylistSection">
                <div className="PlaylistSectionContainer">
                    <h1 id="playlista" className="PlaylistSectionTitle"><a href="https://open.spotify.com/playlist/6kG5IPJjb2xyu0mouhET7B?si=2c503a1faf56490d" target="_blank">Playlista</a></h1>
                    <SearchBar elements={elements} setSearchResults={setSearchResults} />
                    <ListPage searchResults={searchResults} loaded={loaded} elements={elements} number={pageNumber} />
                </div>
            </section>
            <Footer />
            {notifications.map((notification, index) => (
            <Notification 
                key={index} 
                message={notification.message} 
                onClose={() => handleCloseNotification(index)} 
                type={notification.type} 
            />
            ))}
        </div>
    )
}

export default App;