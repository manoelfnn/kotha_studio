const staticCacheName = 'pwa-v1.97';

this.addEventListener('install', (event) => {
    this.skipWaiting();

    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll([
                '/',
                'index.html',
                'main.js',

                'assets/css/font-awesome.min.css',
                'assets/css/bootstrap.min.css',
                'assets/css/codemirror.min.css',
                'assets/css/estilo.min.css',

                'assets/js/jquery.min.js',
                'assets/js/popper.min.js',
                'assets/js/bootstrap.min.js',
                'assets/js/codemirror.min.js',
                'assets/js/mark-selection.min.js',
                'assets/js/show-hint.min.js',
                'assets/js/cota.js',


                'assets/fonts/fontawesome-webfont.woff',
                'assets/fonts/fontawesome-webfont.woff2',

                'assets/fonts/1db29588408eadbd4406aae9238555eb.woff',
                'assets/fonts/1db29588408eadbd4406aae9238555eb.woff2',

                'assets/images/512x512.png',
                'assets/images/logo-preto.png',
                'assets/images/sprites/1.jpg',
                'assets/images/sprites/2.jpg',
            ]);
        })
    );
});

// Clear cache on activate
this.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith('pwa-')))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});


this.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                // return caches.match('/erro.html');
            })
    )
});
