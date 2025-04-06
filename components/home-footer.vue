<template>
    <footer class="bg-red-600 text-black py-8 m-4 border-shadow-lg font-mono">
        <!-- Footer Top Section -->
        <section
            class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center mb-6"
        >
            <header>
                <h1 class="text-4xl font-bold">Radiowęzeł LO2</h1>
            </header>
            <ul class="flex space-x-4 mt-4 md:mt-0">
                <li>
                    <a
                        href="https://open.spotify.com/user/31sejasvsuyf46kb7c5fwrs74fue?si=8c0f7f67e4554a9e"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-xl md:text-4xl"
                    >
                        <Icon name="mdi:spotify" />
                    </a>
                </li>
                <li>
                    <a
                        href="https://www.facebook.com/lo2rac/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-xl md:text-4xl"
                    >
                        <Icon name="ic:baseline-facebook" />
                    </a>
                </li>
                <li>
                    <a
                        href="https://twitter.com/lo2rac/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-xl md:text-4xl"
                    >
                        <Icon name="prime:twitter" />
                    </a>
                </li>
                <li>
                    <a
                        href="https://www.instagram.com/2lo_raciborz/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-xl md:text-4xl"
                    >
                        <Icon name="hugeicons:instagram" />
                    </a>
                </li>
                <li>
                    <a
                        href="https://www.tiktok.com/@2lo_raciborz/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-xl md:text-4xl"
                    >
                        <Icon name="ic:baseline-tiktok" />
                    </a>
                </li>
            </ul>
        </section>

        <!-- Divider -->
        <div class="border-t-2 border-black mx-4 my-8" />

        <!-- Footer Body Section -->
        <section
            class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-6"
        >
            <div>
                <h1 class="text-2xl font-semibold mb-4">Adres</h1>
                <ul class="space-y-2">
                    <li>II Liceum Ogólnokształcące im. Adama Mickiewicza</li>
                    <li>Kard. S. Wyszyńskiego 3</li>
                    <li>47-400 Racibórz</li>
                </ul>
            </div>

            <div>
                <h1 class="text-2xl font-semibold mb-4">O stronie</h1>
                <ul class="space-y-2">
                    <li>
                        <NuxtLink to="#nav_menu" class="hover:underline">
                            Strona główna
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="#playlista" class="hover:underline">
                            Playlista
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="#" class="hover:underline">
                            Propozycje
                        </NuxtLink>
                    </li>
                </ul>
            </div>

            <div>
                <h1 class="text-2xl font-semibold mb-4">Kontakt</h1>
                <ul class="space-y-2">
                    <li>
                        <a
                            href="mailto:lo2radiowezel@proton.me"
                            class="hover:underline"
                        >
                            Poczta
                        </a>
                    </li>
                    <li>
                        <a href="#" class="hover:underline"> Instagram </a>
                    </li>
                    <li>
                        <a href="#" class="hover:underline"> TikTok </a>
                    </li>
                </ul>
            </div>

            <div>
                <h1 class="text-2xl font-semibold mb-4">Informacje</h1>
                <ul class="space-y-2">
                    <li>©Radiowęzeł LO2</li>
                    <li>
                        <a
                            href="https://open.spotify.com/playlist/6kG5IPJjb2xyu0mouhET7B?si=bf71003228344627"
                            class="hover:underline"
                        >
                            Playlista Spotify
                        </a>
                    </li>
                    <li>
                        <a
                            target="_blank"
                            href="https://www.instagram.com/mikusshepard/"
                            class="hover:underline"
                        >
                            Pomysłodawca: Mikus
                        </a>
                    </li>
                    <li>
                        <a
                            target="_blank"
                            href="https://www.instagram.com/mikusshepard/"
                            class="hover:underline"
                        >
                            Wykonawca: Kiju, Mikus
                        </a>
                    </li>
                </ul>
            </div>
        </section>

        <!-- Divider -->
        <div class="border-t-2 border-black mx-4 my-8" />

        <!-- Footer Bottom Section -->
        <section
            class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center"
        >
            <span>
                Copyright ©2024
                <span>Radiowęzeł LO2</span>
            </span>
            <span> Wszelkie prawa zastrzeżone </span>
        </section>
    </footer>
</template>
