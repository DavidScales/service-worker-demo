/*jshint esversion:6*/
(function() {
  'use strict';

  self.addEventListener('install', function(event) {
    console.log('service worker installing...');
    clients.matchAll({includeUncontrolled: true}).then((clients) => {
      clients.forEach((client) => {
        client.postMessage('service-worker-v2.js installed!');
      });
    });
  });

  self.addEventListener('activate', function(event) {
    console.log('service worker activating...');
    clients.matchAll({includeUncontrolled: true}).then((clients) => {
      clients.forEach((client) => {
        client.postMessage('service-worker-v2.js activated!');
      });
    });
  });

})();
