// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCu5rVAFURcG3SqsEvyT23shwZicSYwJE0",
  authDomain: "casino-16473.firebaseapp.com",
  projectId: "casino-16473",
  storageBucket: "casino-16473.firebasestorage.app",
  messagingSenderId: "424239660166",
  appId: "1:424239660166:web:cf26fc894604189030e507",
  measurementId: "G-P31KME5F20"
};

if (typeof firebaseConfig !== 'undefined') {
  window.FIREBASE_CONFIG = firebaseConfig;
}

window.dbPromise = new Promise(function(resolve) {
  window._resolveDb = resolve;
});

if (typeof window.Proxy !== 'undefined') {
  window.db = new Proxy({}, {
    get: function(target, prop) {
      return function() {
        var args = arguments;
        return window.dbPromise.then(function(realDb) {
          if (realDb && typeof realDb[prop] === 'function') {
            return realDb[prop].apply(realDb, args);
          }
          throw new Error('Method ' + prop + ' not found on db');
        });
      };
    }
  });
}