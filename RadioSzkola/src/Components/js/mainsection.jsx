import '/src/Components/css/mainsection.css';

const MainSection = () => {

    return (
        <section className="MainPageSection">
            <div className="MainPageContainer">
                <div className="MainPageGridTwoColumns">
                    <div className="MainPageGridFirstColumn">
                    <h1 className="MainPageTitle">
                        <span>Radiowęzeł</span>
                    </h1>
                    <p className="MainPageDescription">
                    Radiowęzeł LO2 to oficjalna strona szkolnego radiowęzła Liceum Ogólnokształcącego Nr 2 w Raciborzu. Dziel się propozycjami, polub lubiane utwory oraz steruj muzyką na przerwach!</p>

                    <div className="MainPageButtonsContainer">
                        <a href="#playlista"><button className="MainPageButton PlaylistButton">
                        playlista <i className="ri-arrow-down-line"></i>
                        </button></a>

                        <button className="MainPageButton PropositionsButton">propozycje (wkrótce)</button>
                    </div>
                    </div>
                    <div className="MainPageGridSecondColumn"><div className="MainPageImage"></div></div>
                </div>
            </div>
        </section>
    )
}

export default MainSection;