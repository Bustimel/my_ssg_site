const CACHE_NAME = "bus-timel-cache-v1"; // Рекомендуется добавлять версию в имя кэша
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    // Основные страницы (если они не генерируются с уникальными параметрами каждый раз)
    // Помните, что Eleventy генерирует их как /about/index.html, поэтому кэшируем /about/
    '/about/', 
    '/contacts/',
    '/faq/',
    '/routes/', 
    // Основные стили и скрипты
    '/assets/css/style.css',
    '/assets/js/main.js',
    // Основные изображения интерфейса (лого, фон, если они не слишком большие)
    '/assets/img/favicon/favicon.ico',
    // '/assets/img/logo.png', // Если у вас есть логотип
    // '/assets/img/background.webp', // Если хотите кэшировать фон
    // '/assets/img/background-mobile.webp',
    // Шрифты, если они локальные (если Google Fonts, они кэшируются браузером отдельно)
    // '/assets/fonts/montserrat.woff2', // Пример
    // Возможно, manifest.json, если он всегда доступен
    '/assets/img/favicon/manifest.json' 
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Кэшируем основные файлы');
      return cache.addAll(FILES_TO_CACHE)
        .catch(error => {
          console.error('[ServiceWorker] Ошибка при кэшировании файлов в cache.addAll:', error);
          // Можно попытаться кэшировать по одному, чтобы понять, какой файл вызывает проблему
          // FILES_TO_CACHE.forEach(file => {
          //   cache.add(file).catch(err => console.warn(`Не удалось закэшировать: ${file}`, err));
          // });
        });
    })
  );
  self.skipWaiting(); // Активировать новый SW сразу
});

// Логика для удаления старых кэшей при активации нового SW
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) { // Удаляем все кэши, кроме текущего CACHE_NAME
          console.log('[ServiceWorker] Удаление старого кэша', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim(); // Взять под контроль открытые страницы сразу
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // Если ресурс есть в кэше, возвращаем его
      if (response) {
        return response;
      }
      // Иначе, пытаемся загрузить из сети
      return fetch(e.request).then(
        networkResponse => {
          // Если успешно загрузили, можно его закэшировать на будущее (опционально)
          // if (networkResponse && networkResponse.status === 200 && e.request.method === 'GET') {
          //   const responseToCache = networkResponse.clone();
          //   caches.open(CACHE_NAME).then(cache => {
          //     cache.put(e.request, responseToCache);
          //   });
          // }
          return networkResponse;
        }
      ).catch(error => {
        // Обработка ошибок сети, можно вернуть офлайн-страницу, если она есть
        console.warn(`[ServiceWorker] Ошибка сети для ${e.request.url}:`, error);
        // if (e.request.mode === 'navigate') { // Если это переход на страницу
        //   return caches.match('/offline.html'); // Нужен файл offline.html в кэше
        // }
      });
    })
  );
});