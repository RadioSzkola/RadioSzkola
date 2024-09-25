
# LO2 Serwer

Serwer jest stworzony w związku z projektem Radiowęzła. Serwer ten obsługuje wszelkie żądania stworzone przez stronę Radiowęzła.

## Zmienne Środowiskowe

Aby uruchomić projekt, potrzebne są wartości w pliku .env

`MONGODBUSERNAME`
`MONGODBPASSWORD` ---> Nazwa użytkownika oraz hasło do użytkownika dodanego do bazy danych mogącego nią sterować

`MONGODBDATABASE`
`MONGODBTRACKSCOLLECTION`
`MONGODBUSERSCOLLECTION`
`MONGODBUSERIDSCOLLECTION` ---> Baza danych oraz kolekcje potrzebne do działania serwera. W kolekcji z ID użytkowników muszą one być wcześniej wygenerowane

`REFRESH_TOKEN` ---> Token potrzebny do otrzymywania tokenu dostępu do Spotify API

`LFMUSERNAME`
`LFMAPIKEY` ---> Nazwa użytkownika oraz klucz API do [Last.fm](https://last.fm/)

`CLIENT_ID`
`CLIENT_SECRET` ---> ID oraz sekretny klucz aplikacji w [Spotify for Developers](https://developer.spotify.com/)

## Technologie Serwera

 Node, Express, axios, cors, cookie-parser, dotenv, fs, mongodb, node-cron, pug


## Licencja

To oprogramowanie jest objęte licencją zamkniętą. Zabrania się kopiowania, modyfikowania i dystrybuowania go bez pisemnej zgody autora.


## Użycie

Projekt używający serwer

[Radiowęzeł LO2](https://github.com/drapesh/LO2-radiowezel)


## Kontakt

Mail: radiowezelo2.trapped333@passmail.net lub lo2radiowezel@proton.me