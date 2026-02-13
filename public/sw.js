self.options = {
    "domain": "3nbf4.com",
    "zoneId": 10607474
}
self.lary = ""
try {
    importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw')
} catch (e) {
    console.log('External service worker script failed to import. This is normal in development environments or if blocked by ad-blockers.');
}
