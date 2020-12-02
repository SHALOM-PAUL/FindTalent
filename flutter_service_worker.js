'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "573efba67239a44a472d922391872de6",
"assets/assets/Client.png": "29f1216f60f274b4e6dec0f0c4eedf11",
"assets/assets/icons/drop_down.png": "6c4db51abfc3f3c693be62c4fc6b051d",
"assets/assets/icons/search.png": "30c28cc2d578cb9cca754d228a545b96",
"assets/assets/icons/Smart_01.png": "e17f68ec9acce3ad8b371543a5055361",
"assets/assets/icons/Smart_02.png": "2d684bf6227d6994a47bfea2915296f1",
"assets/assets/icons/Smart_03.png": "c3128df89935b0baeaf088eaa55382ce",
"assets/assets/icons/Smart_04.png": "de49c1d1f2589d9e502d1436d7d7c457",
"assets/assets/icons/Smart_05.png": "7b24e05a47d044d6caae28e9c5a2167f",
"assets/assets/icons/Smart_06.png": "5af894cd8208aceb768d485a9efb90c4",
"assets/assets/people/01.png": "d0087f21b837f85bd8f3f406a8cf296c",
"assets/assets/people/02.png": "6d8672bb7aad7fb58ee707f996ea7120",
"assets/assets/people/03.png": "18cfccb08074e408c332d4937b1ed95f",
"assets/assets/people/user.png": "fe1b7faa4bb94cad0cfa6b64e34f80c2",
"assets/assets/people/User_01.png": "6ed1140d667de9a19e7c99307675238b",
"assets/assets/people/User_02.png": "5612b039ea55bc79a3d6c99579572067",
"assets/assets/people/User_03.png": "5fca32f6ad336d24f2a26b1e2c120ed4",
"assets/assets/people/User_04.png": "81ed503074a0ddb5f38fe3e4605f816d",
"assets/assets/people/User_05.png": "337719fff5f1c86176fa0358974e5011",
"assets/assets/people/User_06.png": "8ec00f7a836db4e744001e700f5107f9",
"assets/assets/people/User_07.png": "25c500fbd137798c33dbf5cac804fe3b",
"assets/assets/people/User_08.png": "9f90738b2d0e29a980d2aefc9ad6529d",
"assets/assets/people/User_09.png": "3ee111483770da34a01fc5e610aa586b",
"assets/assets/people/User_10.png": "c7f225895959c8ab7bd361bc644a63f8",
"assets/assets/people/User_11.png": "4387265a667bde8b3ad280170e17cca4",
"assets/assets/people/User_12.png": "b8032ea02e1fe0f71c56f3d996335842",
"assets/assets/shapes/clip_03.png": "8e1654c2ed64429a0649c30c7761a823",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "917a05a792ec2b8d8f129ff28d363501",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "831eb40a2d76095849ba4aecd4340f19",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "a126c025bab9a1b4d8ac5534af76a208",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "d80ca32233940ebadc5ae5372ccd67f9",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "55abbac3426e58f3d9b868f8746ced86",
"/": "55abbac3426e58f3d9b868f8746ced86",
"main.dart.js": "a496f079e94c876a0edf85baeb58f2c1",
"manifest.json": "04a1157e4f367af3fe3ce8fc70944ef7",
"version.json": "426bfe562862a715f01179a3de4624ad"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
