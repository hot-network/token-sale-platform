
const CACHE_NAME = 'hot-token-sale-cache-v2';
const urlsToCache = [
  '/',
  '/index.tsx',
  '/manifest.json',
  '/favicon.ico',
  // App assets
  '/assets/logo.png',
  '/assets/hot.png',
  '/assets/solana.png',
  '/assets/usdc.png',
  '/assets/hero-woman-bg.png',
  '/assets/og-image.png',
  // PWA Icons
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  // Wallet Icons
  '/assets/wallets/phantom.png',
  '/assets/wallets/solflare.png',
  '/assets/wallets/sollet.png',
  '/assets/wallets/backpack.png',
  '/assets/wallets/ledger.png',
  '/assets/wallets/base.png',
  // DEX Icons
  '/assets/dex/raydium.png',
  '/assets/dex/orca.png',
  '/assets/dex/jupiter.png',
  '/assets/dex/meteora.png',
  // External assets
  'https://fonts.googleapis.com/css2?family=Merriweather:wght@700;900&family=Raleway:wght@400;500;600;700&display=swap',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});