// Service Worker for FRCRCE Student Council Website
// Version 2.0 - Production-ready with full PWA support

const CACHE_NAME = 'frcrce-stuco-v2.0';

// Essential resources - must be cached for offline functionality
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/index.css',
  '/scripts/index.js',
  '/favicon.ico',
  '/manifest.json'
];

// Optional resources that might not exist
const optionalResources = [
  '/images/Artboard%201purp.png',
  '/images/technical_planets.png',
  '/images/cultural_planets.png',
  '/images/marketing_planets.png',
  '/images/finance_planets.png',
  '/images/sports_planets.png',
  '/images/media_planets.png'
];

// Install event - cache critical resources with progressive enhancement
self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache:', CACHE_NAME);
        
        // Cache essential resources first (these must succeed)
        return cache.addAll(urlsToCache)
          .then(() => {
            console.log('Essential resources cached successfully');
            
            // Cache optional resources individually (failures won't break installation)
            return Promise.allSettled(
              optionalResources.map(url => 
                cache.add(url)
                  .then(() => console.log(`Cached optional resource: ${url}`))
                  .catch(err => {
                    console.warn(`Failed to cache optional resource ${url}:`, err.message);
                    return null;
                  })
              )
            );
          })
          .then((results) => {
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            console.log(`Optional resources: ${successful} cached, ${failed} failed`);
            
            // Force immediate activation
            return self.skipWaiting();
          });
      })
      .catch(error => {
        console.error('Service worker installation failed:', error);
        // Don't throw - allow installation to continue even if some resources fail
      })
  );
});

// Fetch event - intelligent cache strategies with offline navigation support
self.addEventListener('fetch', function(event) {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle navigation requests (page loads) with network-first, cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          // If network succeeds, cache the response and return it
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
          }
          return response;
        })
        .catch(function() {
          // Network failed, try to serve cached version
          return caches.match(event.request)
            .then(function(cachedResponse) {
              // Return cached page if available
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Fall back to cached index.html for SPA navigation
              return caches.match('/index.html')
                .then(function(indexResponse) {
                  if (indexResponse) {
                    return indexResponse;
                  }
                  
                  // Ultimate fallback - create a simple offline page
                  return new Response(
                    `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Offline - FRCRCE Student Council</title>
                      <style>
                        body { 
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                          text-align: center; 
                          padding: 2rem; 
                          background: #121314; 
                          color: #f0f0f0; 
                          margin: 0;
                          min-height: 100vh;
                          display: flex;
                          flex-direction: column;
                          justify-content: center;
                          align-items: center;
                        }
                        .logo { 
                          width: 64px; 
                          height: 64px; 
                          margin-bottom: 1rem; 
                          background: linear-gradient(45deg, #7e57c2, #9c27b0);
                          border-radius: 50%;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: white;
                          font-weight: bold;
                          font-size: 24px;
                        }
                        h1 { 
                          color: #7e57c2; 
                          margin-bottom: 1rem; 
                        }
                        p { 
                          margin-bottom: 2rem; 
                          opacity: 0.8; 
                        }
                        button {
                          background: linear-gradient(45deg, #7e57c2, #9c27b0);
                          border: none;
                          padding: 12px 24px;
                          border-radius: 24px;
                          color: white;
                          font-size: 16px;
                          cursor: pointer;
                          transition: transform 0.2s;
                        }
                        button:hover { transform: translateY(-2px); }
                      </style>
                    </head>
                    <body>
                      <div class="logo">SC</div>
                      <h1>You're Offline</h1>
                      <p>Please check your internet connection and try again.</p>
                      <button onclick="window.location.reload()">Retry</button>
                    </body>
                    </html>`,
                    { 
                      headers: { 
                        'Content-Type': 'text/html',
                        'Cache-Control': 'no-cache'
                      } 
                    }
                  );
                });
            });
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(function(cachedResponse) {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Fetch from network for static assets
        return fetch(event.request)
          .then(function(response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone and cache the response for static assets
            const responseToCache = response.clone();
            
            // Only cache same-origin GET requests
            if (event.request.url.startsWith(self.location.origin)) {
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(function(error) {
            console.warn('Fetch failed for:', event.request.url, error);
            
            // Provide fallback for different resource types
            if (event.request.destination === 'image') {
              // Return a simple 1x1 transparent PNG for failed images
              return new Response(
                new Uint8Array([
                  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
                  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
                  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
                  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
                  0xDE, 0x00, 0x00, 0x00, 0x09, 0x70, 0x48, 0x59,
                  0x73, 0x00, 0x00, 0x0B, 0x13, 0x00, 0x00, 0x0B,
                  0x13, 0x01, 0x00, 0x9A, 0x9C, 0x18, 0x00, 0x00,
                  0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x57,
                  0x63, 0xF8, 0x0F, 0x00, 0x00, 0x01, 0x00, 0x01,
                  0x5C, 0x6A, 0xE4, 0x84, 0x00, 0x00, 0x00, 0x00,
                  0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
                ]),
                { headers: { 'Content-Type': 'image/png' } }
              );
            }
            
            if (event.request.destination === 'style') {
              // Return empty CSS for failed stylesheets
              return new Response('/* Offline fallback */', {
                headers: { 'Content-Type': 'text/css' }
              });
            }
            
            if (event.request.destination === 'script') {
              // Return empty JS for failed scripts
              return new Response('// Offline fallback', {
                headers: { 'Content-Type': 'application/javascript' }
              });
            }
            
            // Re-throw error for other types
            throw error;
          });
      })
  );
});

// Activate event - cleanup and take control with enhanced logging
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(function(cacheNames) {
        const deletePromises = cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }).filter(Boolean);
        
        return Promise.all(deletePromises);
      }),
      
      // Take control of all clients immediately
      self.clients.claim().then(() => {
        console.log('Service Worker now controlling all pages');
      })
    ])
    .then(() => {
      console.log('Service Worker activated successfully');
      
      // Log cache status for debugging
      return caches.open(CACHE_NAME);
    })
    .then(cache => {
      return cache.keys();
    })
    .then(keys => {
      console.log(`Cache contains ${keys.length} resources:`, keys.map(k => k.url));
    })
    .catch(error => {
      console.error('Service Worker activation error:', error);
    })
  );
});

// Handle skip waiting messages from main thread
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Received SKIP_WAITING message');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    // Respond with cache status for debugging
    caches.open(CACHE_NAME)
      .then(cache => cache.keys())
      .then(keys => {
        event.ports[0].postMessage({
          type: 'CACHE_STATUS',
          cacheSize: keys.length,
          cachedUrls: keys.map(k => k.url)
        });
      });
  }
});

// Log service worker lifecycle events
console.log('Service Worker script loaded - Version 2.0');
