const CACHE_NAME = 'birthday-cache-v4';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
    '/',
    '/manifest.json',
    '/style1.css',
    '/script1.js',
    '/offline.html',
    '/index.html',  // Add main HTML file
    
    // Audio assets
    '/assets/audio/love_story_instrumental.mp3',
    
    // Image assets
    '/assets/images/avif/Anu.avif',
    '/assets/images/avif/Anu1.avif',
    '/assets/images/avif/Anu2.avif',
    '/assets/images/avif/Anu3.avif',
    '/assets/images/avif/chiru.avif',
    
    // WebP fallbacks
    '/assets/images/webp/Anu.webp',
    '/assets/images/webp/Anu1.webp',
    '/assets/images/webp/Anu2.webp',
    '/assets/images/webp/Anu3.webp',
    '/assets/images/webp/chiru.webp',
    
    // Fonts
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap',
    'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap'
];  // Added missing closing bracket

const CACHEABLE_DOMAINS = [
    'cdnjs.cloudflare.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'self'  // Add self to allow caching local assets
];

// Installation - Cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching core assets');
        return cache.addAll(ASSETS_TO_CACHE.map(url => new Request(url, { cache: 'reload' })))
          .then(() => self.skipWaiting());
      })
      .catch(err => console.error('Cache addAll error:', err))
  );
});

// Activation - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName !== CACHE_NAME) {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        }
      })
    )).then(() => self.clients.claim())
  );
});

// Fetch handler with improved caching logic
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and chrome-extension URLs
    if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
        return;
    }

    // Handle navigation requests
    if (request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    // Try network first for navigation
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        return preloadResponse;
                    }

                    const networkResponse = await fetch(request);
                    
                    // Cache successful responses
                    if (networkResponse.ok) {
                        const cache = await caches.open(CACHE_NAME);
                        cache.put(request, networkResponse.clone());
                    }
                    
                    return networkResponse;
                } catch (error) {
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return caches.match(OFFLINE_URL);
                }
            })()
        );
        return;
    }

  // Handle other cacheable requests
  if (isCachable(request)) {
    event.respondWith(
      (async () => {
        // Try to get from cache first
        const cachedResponse = await caches.match(request);
        
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          // Fetch from network
          const networkResponse = await fetch(request);
          
          // Only cache successful, complete responses
          if (networkResponse.ok && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, clone));
          }
          
          return networkResponse;
        } catch (error) {
          // If network fails and we have no cached version, just fail
          console.error('Fetch failed:', error);
          throw error;
        }
      })()
    );
  }
});

// Helper functions
function isCachable(request) {
  const url = new URL(request.url);
  
  // Check against cacheable domains
  const isExternalCacheable = CACHEABLE_DOMAINS.some(domain => 
    url.origin === domain
  );
  
  // Check if it's a local asset
  const isLocalAsset = url.origin === self.location.origin;
  
  // Don't cache the service worker itself
  const isServiceWorker = url.pathname.includes('sw.js');
  
  return (isExternalCacheable || isLocalAsset) && !isServiceWorker;
}

// Background sync handler
self.addEventListener('sync', (event) => {
  if (event.tag === 'retry-failed') {
    event.waitUntil(retryFailedRequests());
  }
});

// Periodic cache cleanup
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanOldCaches());
  }
});

async function retryFailedRequests() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  return Promise.all(requests.map(async req => {
    try {
      const fresh = await fetch(req);
      await cache.put(req, fresh.clone());
    } catch (err) {
      console.log('Failed to update:', req.url);
    }
  }));
}

async function cleanOldCaches() {
  const keys = await caches.keys();
  return Promise.all(keys
    .filter(key => key !== CACHE_NAME)
    .map(key => caches.delete(key))
  );
}
