const CACHE_NAME = 'skysynth-cache-v1';

const CORE_ASSETS = [

  '/',
  '/index.html',
  '/manifest.json',
  '/CHANGELOG.md',
  '/ISSUES.md',
  '/README.md',

  '/styles/input.css',
  '/styles/output.css',

  '/scripts/main.js',
  '/scripts/Tone.min.js',

//   '/assets/PressStart2P-Regular.ttf',
];

const AUDIO_ASSETS = [
  // piano
  '/assets/audio/piano/a4.mp3',
  '/assets/audio/piano/a5.mp3',
  '/assets/audio/piano/a6.mp3',
  '/assets/audio/piano/a7.mp3',
  '/assets/audio/piano/ds4.mp3',
  '/assets/audio/piano/ds5.mp3',
  '/assets/audio/piano/ds6.mp3',
  '/assets/audio/piano/ds7.mp3',

  // bugle
  '/assets/audio/bugle/a4.mp3',
  '/assets/audio/bugle/a5.mp3',
  '/assets/audio/bugle/a6.mp3',
  '/assets/audio/bugle/ds4.mp3',
  '/assets/audio/bugle/ds5.mp3',
  '/assets/audio/bugle/ds6.mp3',

  // e-guitar
  '/assets/audio/eguitar/a3.mp3',
  '/assets/audio/eguitar/a4.mp3',
  '/assets/audio/eguitar/a5.mp3',
  '/assets/audio/eguitar/ds3.mp3',
  '/assets/audio/eguitar/ds4.mp3',
  '/assets/audio/eguitar/ds5.mp3',

  // flute
  '/assets/audio/flute/a4.mp3',
  '/assets/audio/flute/a5.mp3',
  '/assets/audio/flute/a6.mp3',
  '/assets/audio/flute/ds4.mp3',
  '/assets/audio/flute/ds5.mp3',
  '/assets/audio/flute/ds6.mp3',

  // horn
  '/assets/audio/horn/a3.mp3',
  '/assets/audio/horn/a4.mp3',
  '/assets/audio/horn/a5.mp3',
  '/assets/audio/horn/ds3.mp3',
  '/assets/audio/horn/ds4.mp3',
  '/assets/audio/horn/ds5.mp3',

  // meow
  '/assets/audio/meow/a3.mp3',
  '/assets/audio/meow/b2.mp3',
  '/assets/audio/meow/b4.mp3',
  '/assets/audio/meow/b5.mp3',
  '/assets/audio/meow/c4.mp3',
  '/assets/audio/meow/ds4.mp3',
  '/assets/audio/meow/f3.mp3',
  '/assets/audio/meow/f4.mp3',
  '/assets/audio/meow/f5.mp3',

  // music box
  '/assets/audio/musicbox/a3.mp3',
  '/assets/audio/musicbox/a4.mp3',
  '/assets/audio/musicbox/a5.mp3',
  '/assets/audio/musicbox/a6.mp3',
  '/assets/audio/musicbox/ds4.mp3',
  '/assets/audio/musicbox/ds5.mp3',
  '/assets/audio/musicbox/ds6.mp3',
  '/assets/audio/musicbox/ds7.mp3',

  // otto-doo
  '/assets/audio/otto-doo/a3.wav',
  '/assets/audio/otto-doo/bb4.wav',
  '/assets/audio/otto-doo/c3.wav',
  '/assets/audio/otto-doo/c4.wav',
  '/assets/audio/otto-doo/c5.wav',
  '/assets/audio/otto-doo/c6.wav',
  '/assets/audio/otto-doo/c7.wav',
  '/assets/audio/otto-doo/f3.wav',
  '/assets/audio/otto-doo/f4.wav',
  '/assets/audio/otto-doo/f5.wav',
  '/assets/audio/otto-doo/f6.wav',

  // otto-synth
  '/assets/audio/otto-synth/bb4.wav',
  '/assets/audio/otto-synth/c3.wav',
  '/assets/audio/otto-synth/c4.wav',
  '/assets/audio/otto-synth/c5.wav',
  '/assets/audio/otto-synth/c6.wav',
  '/assets/audio/otto-synth/f3.wav',
  '/assets/audio/otto-synth/f4.wav',
  '/assets/audio/otto-synth/f5.wav',
  '/assets/audio/otto-synth/f6.wav'
];


// deepseek

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          // Cache core assets immediately
          cache.addAll(CORE_ASSETS);
          // Cache audio assets in background
          return cache.addAll(AUDIO_ASSETS);
        })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    // Network-first strategy for HTML
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request)
          .catch(() => caches.match('/'))
      );
      return;
    }
  
    // Cache-first strategy for all other requests
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          return cachedResponse || fetch(event.request);
        })
    );
  });
  
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then(keys => 
        Promise.all(
          keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
    );
  });