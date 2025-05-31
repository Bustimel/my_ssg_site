document.addEventListener('DOMContentLoaded', async () => {
    AOS.init({
        once: false, mirror: true, offset: 80, duration: 500, easing: 'ease-in-out'
    });

    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                const isExpanded = mobileMenu.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', String(isExpanded));
            }
        });
    }

    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    const cityNames = {
        sloviansk: 'Слов\'янськ',
        vinnytsia: 'Вінниця',
        kramatorsk: 'Краматорськ',
        druzhkivka: 'Дружківка',
        dobropillia: 'Добропілля',
        pokrovsk: 'Покровськ',
        slovyanka: 'Слов\'янка',
        mezhova: 'Межова',
        pavlohrad: 'Павлоград',
        dnipro: 'Дніпро',
        piatykhatky: 'П\'ятихатки',
        oleksandriia: 'Олександрія',
        znamianka: 'Знам\'янка',
        kropyvnytskyi: 'Кропивницький',
        velyka_vyska: 'Велика Виска',
        khmelove: 'Хмельове',
        smoline: 'Смоліне',
        uman: 'Умань',
        oradivka: 'Орадівка',
        krasnopilka: 'Краснопілка',
        haisyn: 'Гайсин',
        raihorod: 'Райгород',
        nemyriv: 'Немирів',
        voronovytsia: 'Вороновиця',
        lviv: 'Львів',
        ternopil: 'Тернопіль',
        khmelnytskyi: 'Хмельницький',
        novoarkhanhelsk: 'Новоархангельськ', // ПЕРЕВІРТЕ ВІДПОВІДНІСТЬ З ROUTES.JSON! (ймовірно, має бути 'Новоархангельськ' з ь)
        mykolaivka: 'Миколаївка',
        zaporizhzhia: 'Запоріжжя',
        kobleve: 'Коблево',
        mykolaiv: 'Миколаїв',
        bashtanka: 'Баштанка',
        novyi_buh: 'Новий Буг',
        kazanka: 'Казанка',
        kryvyi_rih: 'Кривий Ріг',
        odesa: 'Одеса',
        kyiv: 'Київ',
        boryspil: 'Бориспіль',
        pyriatyn: 'Пирятин',
        lubny: 'Лубни',
        khorol: 'Хорол',
        reshetylivka: 'Решитилівка',
        poltava: 'Полтава',
        karlivka: 'Карлівка',
        krasnohrad: 'Красноград',
        samar: 'Самар', // Якщо "Новомосковськ" = "Самар", то в routes.json має бути "Самар"
        // novomoskovsk_samar: 'Новомосковськ (Самар)', // Видалено, якщо об'єднано з 'Самар'
        // novomoskovsk: 'Новомосковськ', // Видалено, якщо об'єднано з 'Самар'
        zolotonosha: 'Золотоноша',
        smila: 'Сміла',
        kamianka: 'Кам\'янка',
        izium: 'Ізюм',
        hryshyne: 'Гришине',
        babanka: 'Бабанка',
        cherkasy: 'Черкаси',
        rivne: 'Рівне',
        zhytomyr: 'Житомир',
        sumy: 'Суми',
        kharkiv: 'Харків',
        kaniv: 'Канів',
        rodynske: 'Родинське',
        oleksandrivka: 'Олександрівка'
    };

    let allRoutesData = [];
    window.startChoices = null; 
    window.endChoices = null;
    window.searchStartSidebarChoices = null;
    window.searchEndSidebarChoices = null;

    const staticPopularRoutesData = [
        { imgSrc: '/assets/img/card-1.webp', imgAlt: "Міжміський автобус Краматорськ – Черкаси", routeName: "Краматорськ – Черкаси", routeLink: "/routes/kramatorsk-cherkasy.html", departure: "Уточнюйте", travelTime: "Уточнюйте", priceText: "Уточнюйте грн" },
        { imgSrc: '/assets/img/card-2.webp', imgAlt: "Міжміський автобус Слов’янськ – Вінниця", routeName: "Слов’янськ – Вінниця", routeLink: "/routes/sloviansk-vinnytsia.html", departure: "Уточнюйте", travelTime: "Уточнюйте", priceText: "Уточнюйте грн" },
        { imgSrc: '/assets/img/card-3.webp', imgAlt: "Міжміський автобус Дружківка – Вінниця", routeName: "Дружківка – Вінниця", routeLink: "/routes/druzhkivka-vinnytsia.html", departure: "5:00", travelTime: "5:00 – 15:50", priceText: "1700 грн" },
        { imgSrc: '/assets/img/card-4.webp', imgAlt: "Міжміський автобус Краматорськ – Львів", routeName: "Краматорськ – Львів", routeLink: "/routes/kramatorsk-lviv.html", departure: "5:00", travelTime: "5:00 – 22:10", priceText: "Уточнюйте грн" },
        { imgSrc: '/assets/img/card-5.webp', imgAlt: "Автобус Кропивницький – Вінниця", routeName: "Кропивницький – Вінниця", routeLink: "/routes/kropyvnytskyi-vinnytsia.html", departure: "11:45", travelTime: "11:45 – 15:50", priceText: "Уточнюйте грн" },
        { imgSrc: '/assets/img/card-6.webp', imgAlt: "Міжміський автобус Кропивницький – Ізюм", routeName: "Кропивницький – Ізюм", routeLink: "/routes/kropyvnytskyi-izium.html", departure: "9:30", travelTime: "9:30 – 18:30", priceText: "Уточнюйте грн" },
        { imgSrc: '/assets/img/card-7.webp', imgAlt: "Міжміський автобус Межова – Олександрія", routeName: "Межова – Олександрія", routeLink: "/routes/mezhova-oleksandriia.html", departure: "6:30", travelTime: "6:30 – 10:45", priceText: "Уточнюйте грн" },
        { imgSrc: '/assets/img/card-8.webp', imgAlt: "Міжміський автобус Слов’янськ – Миколаїв", routeName: "Слов’янськ – Миколаїв", routeLink: "/routes/sloviansk-mykolaiv.html", departure: "5:10", travelTime: "5:10 – 15:25", priceText: "Уточнюйте грн" },
        { imgSrc: '/assets/img/card-9.webp', imgAlt: "Міжміський автобус Слов’янськ – Рівне", routeName: "Слов’янськ – Рівне", routeLink: "/routes/sloviansk-rivne.html", departure: "4:40", travelTime: "4:40 – 22:40", priceText: "Уточнюйте грн" },
        { imgSrc: '/assets/img/card-10.webp', imgAlt: "Міжміський автобус Дніпро – Вінниця", routeName: "Дніпро – Вінниця", routeLink: "/routes/dnipro-vinnytsia.html", departure: "9:00", travelTime: "9:00 – 15:50", priceText: "1200 грн" }
    ];

    const cleanCityNameJSON = (name) => {
        if (typeof name !== 'string') return '';
        return name.replace(/^\d+\s*\\n/, '').trim().toLowerCase();
    };

    function getLatinKeyByCyrillicName(cyrillicName, cityNamesMap) {
        if (typeof cyrillicName !== 'string' || !cyrillicName.trim()) {
            return null;
        }
        const cleanedCyrName = cleanCityNameJSON(cyrillicName);
        for (const key in cityNamesMap) {
            if (cityNamesMap[key].toLowerCase() === cleanedCyrName) {
                return key;
            }
        }
        const simplifiedCyrName = cleanedCyrName.replace(/['’]/g, "");
        for (const key in cityNamesMap) {
            if (cityNamesMap[key].toLowerCase().replace(/['’]/g, "") === simplifiedCyrName) {
                return key;
            }
        }
        console.warn(`(getLatinKey) Не вдалося знайти ключ для міста: "${cyrillicName}" (оброблене: "${cleanedCyrName}")`);
        return null;
    }

    function preprocessRoutes(rawRouteObjects, cityNamesMap) {
        const processedRoutes = [];
        if (!Array.isArray(rawRouteObjects)) {
            console.error("preprocessRoutes: надані дані не є масивом", rawRouteObjects);
            return processedRoutes;
        }

        rawRouteObjects.forEach((route, index) => {
            let startCityNameUk = null;
            let endCityNameUk = null;

            if (route.stops && route.stops.length > 0) {
                if (route.stops[0]?.city?.uk && typeof route.stops[0].city.uk === 'string' && route.stops[0].city.uk.trim() !== "") {
                    startCityNameUk = route.stops[0].city.uk.trim();
                }
                if (route.stops[route.stops.length - 1]?.city?.uk && typeof route.stops[route.stops.length - 1].city.uk === 'string' && route.stops[route.stops.length - 1].city.uk.trim() !== "") {
                    endCityNameUk = route.stops[route.stops.length - 1].city.uk.trim();
                }
            }
            
            if ((!startCityNameUk || !endCityNameUk) && route.route_name && typeof route.route_name.uk === 'string') {
                const parts = route.route_name.uk.split('–').map(s => s.trim());
                if (parts.length === 2) {
                    if (!startCityNameUk) startCityNameUk = parts[0];
                    if (!endCityNameUk) endCityNameUk = parts[1];
                }
            }

            if (!startCityNameUk || !endCityNameUk) {
                console.warn(`preprocessRoutes [маршрут ${index}]: Не вдалося визначити місто відправлення (${startCityNameUk || 'N/A'}) або прибуття (${endCityNameUk || 'N/A'}) для:`, route.route_name?.uk || "Без назви", route);
                return; 
            }

            const startLat = getLatinKeyByCyrillicName(startCityNameUk, cityNamesMap);
            const endLat = getLatinKeyByCyrillicName(endCityNameUk, cityNamesMap);

            if (!startLat || !endLat) {
                console.warn(`preprocessRoutes [маршрут ${index} - ${route.route_name?.uk || startCityNameUk + ' - ' + endCityNameUk}]: Пропускаємо через не знайдений латинський ключ для "${startCityNameUk}" або "${endCityNameUk}".`);
                return;
            }

            const newRoute = {
                ...route,
                start: startLat,
                end: endLat,
                start_city_display_uk: startCityNameUk, 
                end_city_display_uk: endCityNameUk,
                url_slug: `${startLat}-${endLat}`,
                stops: Array.isArray(route.stops) ? route.stops.map(stop => {
                    let stopCityNameUk = stop.city?.uk;
                    if (typeof stopCityNameUk !== 'string' || !stopCityNameUk.trim()) {
                        return { ...stop, city_lat: null, city_display_uk: "N/A" };
                    }
                    const stopCityLat = getLatinKeyByCyrillicName(stopCityNameUk, cityNamesMap);
                    return { ...stop, city_lat: stopCityLat, city_display_uk: stopCityNameUk };
                }) : []
            };
            
            if (typeof newRoute.price === 'string') {
                const priceNum = parseFloat(newRoute.price.replace(',', '.'));
                if (!isNaN(priceNum)) {
                    newRoute.price = priceNum;
                } else if (newRoute.price.toLowerCase().includes('уточн')) {
                    newRoute.price = "Уточнюйте";
                }
            } else if (typeof newRoute.price !== 'number') {
                newRoute.price = "Уточнюйте"; 
            }

            if (!Array.isArray(newRoute.departure_times) && newRoute.departure_times) {
                newRoute.departure_times = [String(newRoute.departure_times)];
            } else if (!newRoute.departure_times) {
                newRoute.departure_times = ['N/A'];
            }
            
            processedRoutes.push(newRoute);
        });
        return processedRoutes;
    }
    
    const scrollToForm = () => {
        const formEl = document.querySelector('.booking-content'); // Може бути декілька, якщо на сторінці маршруту теж .booking-content
        const headerEl = document.querySelector('header');
        if (formEl && headerEl) { 
            const headerHeight = headerEl.offsetHeight;
            const formTop = formEl.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
            window.scrollTo({ top: formTop, behavior: 'smooth' });
            setTimeout(() => { if (window.startChoices) window.startChoices.showDropdown(); }, 700);
        }
    };

    function handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const startCityKeyFromUrl = urlParams.get('start');
        const endCityKeyFromUrl = urlParams.get('end');
        if (startCityKeyFromUrl) {
            const checkChoicesReady = setInterval(() => {
                if (window.startChoices && window.endChoices && (allRoutesData.length > 0 || Object.keys(cityNames).length > 0) ) {
                    clearInterval(checkChoicesReady);
                    if (cityNames[startCityKeyFromUrl]) {
                        try { window.startChoices.setChoiceByValue(startCityKeyFromUrl); } catch(e) {console.warn("Помилка встановлення міста відправлення з URL:", e)}
                        
                        if (endCityKeyFromUrl && cityNames[endCityKeyFromUrl]) {
                            setTimeout(() => { 
                                const endChoicesInstance = window.endChoices;
                                if (endChoicesInstance && endChoicesInstance.currentState && endChoicesInstance.currentState.choices) {
                                    const endCityOptionExists = endChoicesInstance.currentState.choices.some(choice => choice.value === endCityKeyFromUrl && !choice.disabled);
                                    if (endCityOptionExists) {
                                       try { endChoicesInstance.setChoiceByValue(String(endCityKeyFromUrl)); } catch(e) {console.warn("Помилка встановлення міста прибуття з URL:", e)}
                                        scrollToForm();
                                    } else {
                                         console.warn(`Місто прибуття "${endCityKeyFromUrl}" з URL недоступне для обраного міста відправлення "${startCityKeyFromUrl}".`);
                                    }
                                }
                            }, 350); 
                        }
                    } else {
                         console.warn(`Ключ міста відправлення з URL "${startCityKeyFromUrl}" не знайдений в cityNames.`);
                    }
                }
            }, 100);
        }
    }

    async function loadAndProcessMainRoutes() {
        try {
            const response = await fetch('/assets/routes.json'); // Переконайтесь, що routes.json в папці assets
            if (!response.ok) {
                throw new Error(`HTTP помилка! статус: ${response.status}, url: ${response.url}`);
            }
            const rawRoutesData = await response.json();
            console.log("Завантажені сирі дані маршрутів (rawRoutesData):", JSON.parse(JSON.stringify(rawRoutesData)));

            if (rawRoutesData && Array.isArray(rawRoutesData.routes)) {
                allRoutesData = preprocessRoutes(rawRoutesData.routes, cityNames);
                console.log("Оброблені маршрути (allRoutesData):", JSON.parse(JSON.stringify(allRoutesData))); 
            } else {
                console.error("Дані маршрутів з JSON не в очікуваному форматі:", rawRoutesData);
                allRoutesData = [];
            }
            
            populateCityOptions();
            handleUrlParams(); 
            if (document.getElementById('routes-list')) {
                renderAllRoutesList(allRoutesData);
            }

        } catch (error) {
            console.error("Критична помилка при завантаженні або обробці маршрутів:", error);
            allRoutesData = [];
            populateCityOptions(); 
            handleUrlParams(); 
            const routeInfoEl = document.getElementById('route-info');
            if (routeInfoEl) routeInfoEl.textContent = 'Помилка завантаження даних.';
            const loadingMessageEl = document.getElementById('loading-message');
            if (loadingMessageEl) {
                loadingMessageEl.textContent = 'Помилка завантаження маршрутів.';
            }
        }
    }

    function renderStaticPopularRoutes() {
        const routesContainer = document.getElementById('routes-container');
        if (!routesContainer) return;
        routesContainer.innerHTML = '';
        staticPopularRoutesData.forEach((route, index) => {
            const routeCard = document.createElement('div');
            routeCard.className = 'route-card';
            routeCard.setAttribute('data-aos', 'fade-up');
            routeCard.setAttribute('data-aos-delay', `${100 + index * 50}`);
            const finalRouteLink = route.routeLink.endsWith('/') ? route.routeLink : (route.routeLink.includes('.html') ? route.routeLink : `${route.routeLink}.html`);
            routeCard.innerHTML = `
                <img alt="${route.imgAlt}" class="w-full h-40 object-cover" loading="lazy" src="${route.imgSrc}"/>
                <div class="route-card-content">
                    <a class="font-semibold text-blue-700 hover:underline" href="${finalRouteLink}">${route.routeName}</a>
                    <p>Відправлення: ${route.departure}</p>
                    <p>Час: ${route.travelTime}</p>
                    <p>Ціна: ${route.priceText}</p>
                </div>`;
            routesContainer.appendChild(routeCard);
        });
        if (typeof updateActiveCardTransform === 'function') { setTimeout(updateActiveCardTransform, 0); }
    }

    function populateCityOptions() {
        const selectConfigurations = [
            { id: 'start-city', choicesVarName: 'startChoices', placeholder: 'Звідки їдемо?', type: 'start' },
            { id: 'end-city', choicesVarName: 'endChoices', placeholder: 'Куди їдемо?', type: 'end' },
            { id: 'search-start-sidebar', choicesVarName: 'searchStartSidebarChoices', placeholder: 'Звідки', type: 'search-start' },
            { id: 'search-end-sidebar', choicesVarName: 'searchEndSidebarChoices', placeholder: 'Куди', type: 'search-end' }
        ];

        if (typeof Choices === 'undefined') {
            console.warn('Choices.js не завантажений.');
            return;
        }
        
        const uniqueCityKeys = new Set();
        if (allRoutesData && allRoutesData.length > 0) {
            allRoutesData.forEach(route => {
                if (route.start && cityNames[route.start]) uniqueCityKeys.add(route.start);
                if (route.end && cityNames[route.end]) uniqueCityKeys.add(route.end);
                if (Array.isArray(route.stops)) {
                    route.stops.forEach(stop => {
                        if (stop.city_lat && cityNames[stop.city_lat]) {
                            uniqueCityKeys.add(stop.city_lat);
                        }
                    });
                }
            });
        }
        
        if (uniqueCityKeys.size === 0 && Object.keys(cityNames).length > 0) {
            Object.keys(cityNames).forEach(key => uniqueCityKeys.add(key));
        }

        if (uniqueCityKeys.size === 0) {
            console.warn("Список міст для селектів порожній (uniqueCityKeys is empty).");
        }

        const cityOptions = Array.from(uniqueCityKeys)
            .map(key => ({ value: key, label: cityNames[key] || key }))
            .sort((a, b) => a.label.localeCompare(b.label, 'uk'));

        selectConfigurations.forEach(config => {
            const selectEl = document.getElementById(config.id);
            if (selectEl) {
                const placeholder = [{ value: '', label: config.placeholder, disabled: true, selected: true }];
                
                let currentInstance = null;
                if (config.type === 'start') currentInstance = window.startChoices;
                else if (config.type === 'end') currentInstance = window.endChoices;
                else if (config.type === 'search-start') currentInstance = window.searchStartSidebarChoices;
                else if (config.type === 'search-end') currentInstance = window.searchEndSidebarChoices;

                if (currentInstance && typeof currentInstance.destroy === 'function') {
                    currentInstance.destroy();
                }
                
                const newChoicesInstance = new Choices(selectEl, {
                    searchEnabled: true, searchChoices: true, searchFloor: 1, searchResultLimit: 10,
                    shouldSort: false, placeholderValue: config.placeholder,
                    searchPlaceholderValue: 'Введіть місто', noResultsText: 'Місто не знайдено',
                    itemSelectText: '', removeItemButton: true, choices: placeholder.concat(cityOptions)
                });

                if (config.type === 'start') { window.startChoices = newChoicesInstance; selectEl.addEventListener('change', updateEndCities); }
                else if (config.type === 'end') { window.endChoices = newChoicesInstance; selectEl.addEventListener('change', updateRouteInfo); }
                else if (config.type === 'search-start') { window.searchStartSidebarChoices = newChoicesInstance; }
                else if (config.type === 'search-end') { window.searchEndSidebarChoices = newChoicesInstance; }
            }
        });
    }

    function updateEndCities() {
        if (!window.startChoices || !window.endChoices) { console.warn("updateEndCities: choices не ініціалізовані"); return; }
        const startCityKey = window.startChoices.getValue(true);
        let endCityChoicesOptions = [{ value: '', label: 'Куди їдемо?', disabled: true, selected: true }];
        const allEndCitiesFromData = new Set();

        if (allRoutesData && allRoutesData.length > 0) {
            allRoutesData.forEach(route => {
                if (route.end && cityNames[route.end]) { 
                    allEndCitiesFromData.add(route.end);
                }
            });
        } else { 
            Object.keys(cityNames).forEach(key => allEndCitiesFromData.add(key));
        }

        if (startCityKey) {
            const possibleDestinations = new Set();
            if (allRoutesData && allRoutesData.length > 0) {
                allRoutesData.forEach(route => {
                    if (route.start === startCityKey && route.end && cityNames[route.end]) {
                        possibleDestinations.add(route.end);
                    }
                });
            }
            const destinationsToUse = possibleDestinations.size > 0 ? possibleDestinations : allEndCitiesFromData;
            const sortedDestinations = Array.from(destinationsToUse)
                .map(key => ({ value: key, label: cityNames[key] || key }))
                .sort((a, b) => a.label.localeCompare(b.label, 'uk'));
            endCityChoicesOptions = endCityChoicesOptions.concat(sortedDestinations);
        } else { 
            const sortedAllEndCities = Array.from(allEndCitiesFromData)
                .map(key => ({ value: key, label: cityNames[key] || key }))
                .sort((a, b) => a.label.localeCompare(b.label, 'uk'));
            endCityChoicesOptions = endCityChoicesOptions.concat(sortedAllEndCities);
        }
        
        const currentEndCityValue = window.endChoices.getValue(true);
        window.endChoices.setChoices(endCityChoicesOptions, 'value', 'label', true);

        if (startCityKey && currentEndCityValue === startCityKey) {
            window.endChoices.setValue([{value: '', label: 'Куди їдемо?'}]);
        } else if (currentEndCityValue) {
            const isValidChoice = endCityChoicesOptions.some(opt => opt.value === currentEndCityValue);
            if (isValidChoice) {
                try { window.endChoices.setChoiceByValue(String(currentEndCityValue)); } catch(e) { /*ignore*/ }
            } else {
                 window.endChoices.setValue([{value: '', label: 'Куди їдемо?'}]);
            }
        }
        updateRouteInfo();
    }

    function updateRouteInfo() {
        if (!window.startChoices || !window.endChoices) { console.warn("updateRouteInfo: choices не ініціалізовані"); return; }
        const startCityKey = window.startChoices.getValue(true);
        const endCityKey = window.endChoices.getValue(true);
        const routeInfoEl = document.getElementById('route-info');
        if (!routeInfoEl) return;
        routeInfoEl.textContent = '';

        if (startCityKey && endCityKey && startCityKey !== endCityKey) {
            const directRoute = allRoutesData.find(r => r.start === startCityKey && r.end === endCityKey);
            if (directRoute) {
                let priceDisplay = typeof directRoute.price === 'number' ? directRoute.price + ' грн' : (directRoute.price || 'Уточнюйте');
                let durationDisplay = directRoute.duration;
                if (!durationDisplay && directRoute.stops && directRoute.stops.length >= 2) {
                    const firstTime = directRoute.stops[0]?.time;
                    const lastTime = directRoute.stops[directRoute.stops.length - 1]?.time;
                    if (firstTime && lastTime) {
                         durationDisplay = `${firstTime} – ${lastTime}`;
                    } else {
                        durationDisplay = 'Уточнюйте';
                    }
                } else if (!durationDisplay) {
                    durationDisplay = 'Уточнюйте';
                }
                routeInfoEl.textContent = `Ціна: ${priceDisplay}, Час: ${durationDisplay}`;
            } else {
                routeInfoEl.textContent = 'Прямих рейсів немає. Деталі уточнюйте.';
            }
        } else if (startCityKey && endCityKey && startCityKey === endCityKey) {
            routeInfoEl.textContent = 'Місто відправлення та прибуття не можуть співпадати.';
        }
    }
    
    function renderAllRoutesList(routesToRender) {
        const routesListContainer = document.getElementById('routes-list');
        const loadingMessage = document.getElementById('loading-message');
        const routeCountEl = document.getElementById('route-count');

        if (!routesListContainer) return; 

        if (!routesToRender || routesToRender.length === 0) {
            if (loadingMessage) loadingMessage.textContent = 'Маршрути не знайдено.';
            if (routeCountEl) routeCountEl.textContent = 'Знайдено маршрутів: 0';
            routesListContainer.innerHTML = '<p class="text-center text-gray-600">Відповідних маршрутів не знайдено.</p>';
            return;
        }
        if (loadingMessage) loadingMessage.style.display = 'none';
        
        if (routeCountEl) {
            routeCountEl.textContent = `Знайдено маршрутів: ${routesToRender.length}`;
        }
        routesListContainer.innerHTML = ''; 

        routesToRender.forEach(route => {
            const card = document.createElement('div');
            card.className = 'route-list-card glass p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4';
            const routeUrl = `/routes/${route.url_slug}.html`;

            let priceDisplay = typeof route.price === 'number' ? route.price + ' грн' : (route.price || 'Уточнюйте');
            let durationDisplay = route.duration;
             if (!durationDisplay && route.stops && route.stops.length >= 2) {
                const firstTime = route.stops[0]?.time;
                const lastTime = route.stops[route.stops.length - 1]?.time;
                if (firstTime && lastTime) {
                     durationDisplay = `${firstTime} – ${lastTime}`;
                } else {
                    durationDisplay = 'Уточнюйте';
                }
            } else if (!durationDisplay) {
                 durationDisplay = 'Уточнюйте';
            }
            
            card.innerHTML = `
                <div class="flex-grow">
                    <h3 class="text-xl font-bold text-blue-700 mb-1">${route.start_city_display_uk || cityNames[route.start] || route.start} – ${route.end_city_display_uk || cityNames[route.end] || route.end}</h3>
                    <p class="text-sm text-gray-600">Частота: ${route.frequency || 'Щоденно'}</p>
                    <p class="text-sm text-gray-600">Час у дорозі: ${durationDisplay}</p>
                </div>
                <div class="text-left md:text-right mt-4 md:mt-0">
                    <p class="text-lg font-semibold text-gray-800 mb-2">${priceDisplay}</p>
                    <a href="${routeUrl}" class="bg-yellow-400 text-black rounded-full px-6 py-2 font-semibold transition hover:bg-yellow-500 shadow text-sm">Детальніше</a>
                </div>
            `;
            routesListContainer.appendChild(card);
        });
    }
    
    const routesContainerEl = document.getElementById('routes-container'); 
    function updateActiveCardTransform() { 
        if (!routesContainerEl) return;
        const cards = routesContainerEl.querySelectorAll('.route-card');
        if (cards.length === 0) return;
        const containerCenter = routesContainerEl.scrollLeft + routesContainerEl.offsetWidth / 2;
        cards.forEach(card => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(containerCenter - cardCenter);
            const maxScale = 1.15; const scaleFactor = 800;
            const scale = Math.max(1, maxScale - (distance / scaleFactor));
            card.style.transform = `scale(${scale})`;
            card.style.zIndex = distance < card.offsetWidth * 0.75 ? "10" : "1";
        });
    }
    if (routesContainerEl) { 
        let isScrollingTimeout;
        routesContainerEl.addEventListener('scroll', () => {
            requestAnimationFrame(updateActiveCardTransform);
            clearTimeout(isScrollingTimeout);
            isScrollingTimeout = setTimeout(() => {
                const cards = routesContainerEl.querySelectorAll('.route-card');
                if (cards.length === 0) return;
                let closestCard = null; let closestDistance = Infinity;
                const containerScrollCenter = routesContainerEl.scrollLeft + routesContainerEl.offsetWidth / 2;
                cards.forEach(card => {
                    const cardScrollCenter = card.offsetLeft + card.offsetWidth / 2;
                    const distance = Math.abs(containerScrollCenter - cardScrollCenter);
                    if (distance < closestDistance) { closestDistance = distance; closestCard = card; }
                });
                if (closestCard && routesContainerEl.scrollSnapType === 'x mandatory') {
                    routesContainerEl.scrollTo({
                        left: closestCard.offsetLeft - (routesContainerEl.offsetWidth / 2 - closestCard.offsetWidth / 2),
                        behavior: 'smooth'
                    });
                }
            }, 150); 
        }, { passive: true });
         setTimeout(updateActiveCardTransform, 50); 
    }

    // --- УНІВЕРСАЛЬНИЙ ОБРОБНИК ДЛЯ ВСІХ ФОРМ ВІДПРАВКИ ---
    async function handleFormSubmit(event, formElement) {
        event.preventDefault();
        const submitButton = formElement.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = 'Відправка...';
        submitButton.disabled = true;

        try {
            const formData = new FormData(formElement);

            // Для головної форми бронювання додаємо start_city та end_city
            if (formElement.id === 'booking-form') {
                if (window.startChoices && window.startChoices.getValue(true)) {
                    const startCityKey = window.startChoices.getValue(true);
                    formData.append('start_city', cityNames[startCityKey] || startCityKey);
                }
                if (window.endChoices && window.endChoices.getValue(true)) {
                    const endCityKey = window.endChoices.getValue(true);
                    formData.append('end_city', cityNames[endCityKey] || endCityKey);
                }
            }
            // Honeypot поле new FormData(formElement) має підхопити автоматично.

            const response = await fetch('/send_mail.php', { method: 'POST', body: formData });
            const result = await response.json(); // Завжди намагаємося розпарсити JSON

            if (response.ok && result.status === 'success') {
                alert(result.message || 'Дані успішно відправлено!');
                formElement.reset();
                if (formElement.id === 'booking-form') { // Скидання селектів тільки для головної форми
                    if (window.startChoices) try { window.startChoices.setChoiceByValue(''); } catch (err) {}
                    if (window.endChoices) try { window.endChoices.setChoiceByValue(''); } catch (err) {}
                    const routeInfoEl = document.getElementById('route-info');
                    if (routeInfoEl) routeInfoEl.textContent = '';
                }
            } else {
                alert(result.message || `Помилка при відправці (${response.statusText || response.status}). Спробуйте ще раз або зв'яжіться з нами по телефону.`);
            }
        } catch (error) {
            console.error("Помилка відправки форми:", error);
            alert('Помилка при відправці. Перевірте підключення до Інтернету та спробуйте ще раз.');
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    }

    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => handleFormSubmit(e, bookingForm));
    }

    // Обробник для форм на сторінках маршрутів (може бути декілька)
    document.querySelectorAll('form[id^="booking-form-route-"]').forEach(form => {
        form.addEventListener('submit', (e) => handleFormSubmit(e, form));
    });
    
    // Обробник для контактної форми
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => handleFormSubmit(e, contactForm));
    }

    // --- Кінець універсального обробника ---
    
    const findRouteButton = document.getElementById('find-route');
    if (findRouteButton) {
        findRouteButton.addEventListener('click', () => {
            if (!window.startChoices || !window.endChoices) return;
            const startValueKey = window.startChoices.getValue(true); 
            const endValueKey = window.endChoices.getValue(true);
            const dateInput = document.querySelector('#booking-form input[name="date"]');
            const dateValue = dateInput ? dateInput.value : '';
            
            if (startValueKey && endValueKey) {
                const matchingRoute = allRoutesData.find(r => r.start === startValueKey && r.end === endValueKey);
                const slug = matchingRoute?.url_slug; 
                if (slug) {
                    let url = `/routes/${slug}.html`; 
                    if (dateValue) { url += `?date=${encodeURIComponent(dateValue)}`;}
                    window.location.href = url;
                } else {
                    alert('Для обраного маршруту не знайдено сторінки. Будь ласка, уточніть у оператора.');
                    console.warn("Не найден url_slug для перехода на страницу маршрута:", startValueKey, endValueKey);
                }
            } else { alert('Оберіть маршрут повністю!'); }
        });
    }

    const createRipple = (event, el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const diameter = Math.max(rect.width, rect.height); 
        const radius = diameter / 2;
        const ripple = document.createElement("span"); 
        ripple.className = "ripple"; 
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - rect.left - radius}px`;
        ripple.style.top = `${event.clientY - rect.top - radius}px`;
        const existing = el.querySelector(".ripple"); 
        if (existing) existing.remove();
        el.appendChild(ripple); 
        setTimeout(() => ripple.remove(), 600);
        if (navigator.vibrate) navigator.vibrate(40);
    };

    document.querySelectorAll("button, .glass-button, .booking-toggle, a.call-button, a.viber-button, a.icon-button, #chat-button-mobile").forEach(el => {
        el.addEventListener("click", e => createRipple(e, el));
    });

    const mobileButtonsContainer = document.getElementById('mobile-buttons');
    if (mobileButtonsContainer) { 
        let mobileButtonsTimer;
        const mobileActionButtons = mobileButtonsContainer.querySelectorAll('.icon-button');
        window.addEventListener('scroll', () => {
            mobileActionButtons.forEach(btn => btn.classList.add('transparent'));
            clearTimeout(mobileButtonsTimer);
            mobileButtonsTimer = setTimeout(() => {
                mobileActionButtons.forEach(btn => btn.classList.remove('transparent'));
            }, 200);
        }, { passive: true });
    }
    
    if (document.getElementById('route-search-form-sidebar')) {
        const routeSearchFormSidebar = document.getElementById('route-search-form-sidebar');
        const resetFiltersButton = document.getElementById('reset-filters');
        
        routeSearchFormSidebar.addEventListener('submit', function(e) {
            e.preventDefault();
            const startCity = window.searchStartSidebarChoices ? window.searchStartSidebarChoices.getValue(true) : null;
            const endCity = window.searchEndSidebarChoices ? window.searchEndSidebarChoices.getValue(true) : null;
            
            filterRoutesList(startCity, endCity);
            if (resetFiltersButton) resetFiltersButton.style.display = (startCity || endCity) ? 'block' : 'none';
        });

        if (resetFiltersButton) {
            resetFiltersButton.addEventListener('click', function() {
                if (window.searchStartSidebarChoices) window.searchStartSidebarChoices.setValue([{value: '', label: 'Звідки'}]);
                if (window.searchEndSidebarChoices) window.searchEndSidebarChoices.setValue([{value: '', label: 'Куди'}]);
                filterRoutesList(null, null); 
                resetFiltersButton.style.display = 'none';
            });
        }
    }
    function filterRoutesList(startCityKey, endCityKey) {
        let filteredRoutes = allRoutesData;
        if (startCityKey) {
            filteredRoutes = filteredRoutes.filter(route => route.start === startCityKey);
        }
        if (endCityKey) {
            filteredRoutes = filteredRoutes.filter(route => route.end === endCityKey);
        }
        renderAllRoutesList(filteredRoutes); 
    }
   
    // Инициализация
    renderStaticPopularRoutes();
    await loadAndProcessMainRoutes(); 

}); // Конец DOMContentLoaded

// Глобальні функції для чату (викликаються через onclick в HTML)
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    const chatButton = document.getElementById('chat-button-mobile');
    if (chatWindow && chatButton) {
        const isHidden = chatWindow.style.display === 'none' || chatWindow.style.display === '';
        chatWindow.style.display = isHidden ? 'flex' : 'none';
        chatButton.setAttribute('aria-expanded', String(!isHidden));
        if (isHidden) { 
            const messageInput = document.getElementById('chat-message-input');
            if (messageInput) messageInput.focus();
        }
    }
}

async function sendMessage() {
    const messageInput = document.getElementById('chat-message-input');
    const messagesContainer = document.getElementById('chat-messages');
    if (!messageInput || !messagesContainer) return;
    const text = messageInput.value.trim();
    if (!text) return;

    messagesContainer.innerHTML += `<div class="text-right p-2 my-1 rounded-lg bg-blue-500 text-white self-end clear-both max-w-[80%] ml-auto"><b>Ви:</b> ${text}</div>`;
    messageInput.value = ""; messagesContainer.scrollTop = messagesContainer.scrollHeight;
    let typingIndicator;
    try {
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'text-left p-2 my-1 rounded-lg bg-gray-200 text-gray-600 self-start italic clear-both max-w-[80%]';
        typingIndicator.textContent = 'Диспетчер друкує...';
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        const response = await fetch("https://bustimel-bot.onrender.com/chat", { 
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text })
        });
        if (typingIndicator && messagesContainer.contains(typingIndicator)) messagesContainer.removeChild(typingIndicator);
        if (response.ok) {
            const data = await response.json();
            messagesContainer.innerHTML += `<div class="text-left p-2 my-1 rounded-lg bg-gray-200 text-gray-800 self-start clear-both max-w-[80%]"><b>Диспетчер:</b> ${data.reply}</div>`;
        } else {
            messagesContainer.innerHTML += `<div class="text-left p-2 my-1 rounded-lg bg-red-100 text-red-700 self-start clear-both max-w-[80%]"><b>Помилка:</b> не вдалося отримати відповідь (${response.status})</div>`;
        }
    } catch (error) {
        if (typingIndicator && messagesContainer.contains(typingIndicator)) messagesContainer.removeChild(typingIndicator);
        console.error("Помилка відправки в чат:", error);
        messagesContainer.innerHTML += `<div class="text-left p-2 my-1 rounded-lg bg-red-100 text-red-700 self-start clear-both max-w-[80%]"><b>Помилка:</b> не вдалося підключитися до сервера чату.</div>`;
    }
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

const chatInputForEnter = document.getElementById('chat-message-input');
if (chatInputForEnter) {
    chatInputForEnter.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
    });
}