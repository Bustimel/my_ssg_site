const fs = require('node:fs');
const path = require('node:path');

// ВАЖЛИВО: Цей об'єкт має бути ІДЕНТИЧНИМ об'єкту cityNames у вашому main.js!
// Переконайтеся, що він повний та всі назви відповідають тим, що в routes.json.
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
    novoarkhanhelsk: 'Новоархангельськ',
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
    samar: 'Самар',
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

function cleanCityNameJSON(name) {
    if (typeof name !== 'string') return '';
    return name.replace(/^\d+\s*\\n/, '').trim().toLowerCase();
}

function getLatinKeyByCyrillicName(cyrillicName, cityNamesMap) {
    if (typeof cyrillicName !== 'string' || !cyrillicName.trim()) {
        console.warn(`[Eleventy Data] getLatinKeyByCyrillicName: Отримано некоректне ім'я міста: ${cyrillicName}`);
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
    console.warn(`[Eleventy Data] getLatinKeyByCyrillicName: Не вдалося знайти ключ для міста: "${cyrillicName}" (оброблене: "${cleanedCyrName}")`);
    return null; // Важливо повертати null, якщо ключ не знайдено
}

module.exports = async function() {
    let routesJsonPath = path.resolve(__dirname, '../routes.json');
    if (!fs.existsSync(routesJsonPath)) {
        routesJsonPath = path.resolve(__dirname, '../assets/routes.json');
        if (!fs.existsSync(routesJsonPath)) {
            console.error(`[Eleventy Data] routes.json не знайдено ні в корені, ні в /assets. Перевірте шлях.`);
            return [];
        }
    }

    try {
        const rawData = fs.readFileSync(routesJsonPath, 'utf8');
        const rawRoutesObject = JSON.parse(rawData);

        if (!rawRoutesObject || !Array.isArray(rawRoutesObject.routes)) {
            console.error("[Eleventy Data] Помилка формату routes.json: очікується об'єкт з ключем 'routes', що є масивом.");
            return [];
        }

        console.log("[Eleventy Data] Починаємо обробку маршрутів для генерації slug...");
        const slugMap = {}; // Для відстеження дублікатів slug

        const processedRoutes = rawRoutesObject.routes.map((route, index) => {
            let startCityNameUk = null;
            let endCityNameUk = null;
            let routeIdForLog = route.id || `індекс_${index}`; // Для кращого логування

            // Визначаємо startCityNameUk
            if (route.stops && route.stops.length > 0 && route.stops[0]?.city?.uk && typeof route.stops[0].city.uk === 'string' && route.stops[0].city.uk.trim() !== "") {
                startCityNameUk = route.stops[0].city.uk.trim();
            } else if (route.route_name && typeof route.route_name.uk === 'string') {
                const parts = route.route_name.uk.split('–').map(s => s.trim());
                if (parts.length === 2) startCityNameUk = parts[0];
            }

            // Визначаємо endCityNameUk
            if (route.stops && route.stops.length > 0 && route.stops[route.stops.length - 1]?.city?.uk && typeof route.stops[route.stops.length - 1].city.uk === 'string' && route.stops[route.stops.length - 1].city.uk.trim() !== "") {
                endCityNameUk = route.stops[route.stops.length - 1].city.uk.trim();
            } else if (route.route_name && typeof route.route_name.uk === 'string') {
                const parts = route.route_name.uk.split('–').map(s => s.trim());
                if (parts.length === 2) endCityNameUk = parts[1];
            }
            
            if (!startCityNameUk || !endCityNameUk) {
                console.warn(`[Eleventy Data - ID/індекс: ${routeIdForLog}] Не вдалося визначити місто відправлення (${startCityNameUk || 'N/A'}) або прибуття (${endCityNameUk || 'N/A'}) для маршруту: "${route.route_name?.uk || "Без назви"}". Використовується запасний slug.`);
                return { ...route, url_slug: `error-incomplete-cities-${routeIdForLog}` };
            }

            const startLat = getLatinKeyByCyrillicName(startCityNameUk, cityNames);
            const endLat = getLatinKeyByCyrillicName(endCityNameUk, cityNames);

            if (!startLat || !endLat) {
                console.warn(`[Eleventy Data - ID/індекс: ${routeIdForLog}] Не знайдено латинські ключі для "${startCityNameUk}" (->${startLat || 'null'}) або "${endCityNameUk}" (->${endLat || 'null'}). Маршрут: "${route.route_name?.uk}". Використовується запасний slug.`);
                // Спрощений запасний slug, більш унікальний
                const fallbackSlug = `fallback-${startCityNameUk}-${endCityNameUk}-${routeIdForLog}`.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9а-яіїєґ_]+/gi, "-");
                return { ...route, start_city_display_uk: startCityNameUk, end_city_display_uk: endCityNameUk, url_slug: fallbackSlug };
            }

            const currentUrlSlug = `${startLat}-${endLat}`;

            // Логування для кожного маршруту
            console.log(`[Eleventy Data - ID/індекс: ${routeIdForLog}] Обробка: "${startCityNameUk}" -> "${startLat}", "${endCityNameUk}" -> "${endLat}". Згенеровано slug: "${currentUrlSlug}". Оригінальна назва маршруту: "${route.route_name?.uk || 'N/A'}"`);

            if (slugMap[currentUrlSlug]) {
                slugMap[currentUrlSlug].push(routeIdForLog);
                console.error(`---> [Eleventy Data - КОНФЛІКТ!] Знайдено дублікат slug: "${currentUrlSlug}". Маршрути з ID/індексами: ${slugMap[currentUrlSlug].join(', ')}`);
            } else {
                slugMap[currentUrlSlug] = [routeIdForLog];
            }

            return {
                ...route,
                start_city_display_uk: startCityNameUk,
                end_city_display_uk: endCityNameUk,
                url_slug: currentUrlSlug
            };
        });
        
        console.log("[Eleventy Data] Завершено обробку маршрутів.");
        // Виведемо всі дублікати в кінці
        let hasDuplicates = false;
        for (const slug in slugMap) {
            if (slugMap[slug].length > 1) {
                hasDuplicates = true;
                console.error(`---> Підсумковий дублікат slug: "${slug}", генерується для ID/індексів: ${slugMap[slug].join(', ')}`);
            }
        }
        if (!hasDuplicates) {
            console.log("[Eleventy Data] Дублікатів slug не знайдено у підсумку.");
        }

        return processedRoutes;
    } catch (error) {
        console.error("[Eleventy Data] Критична помилка при обробці routes.json:", error);
        return [];
    }
};