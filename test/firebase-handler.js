import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, query, getDocs, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Safe database interface
window.db = null;

try {
  if (!window.FIREBASE_CONFIG) {
    throw new Error("window.FIREBASE_CONFIG is not defined");
  }

  // Initialisierung
  const app = initializeApp(window.FIREBASE_CONFIG);
  const firestore = getFirestore(app);

  // Das mächtige, knappe Interface für die KI
  const realDb = {
    // 1. Daten speichern mit eigener ID (z.B. User-Profile)
    async set(collectionName, docId, data) {
      await setDoc(doc(firestore, collectionName, docId), data, { merge: true });
    },

    // 2. Daten hinzufügen mit automatischer ID (z.B. Blogposts, Logeinträge)
    async add(collectionName, data) {
      const docRef = await addDoc(collection(firestore, collectionName), data);
      return docRef.id;
    },

    // 3. Einen einzelnen Datensatz abrufen
    async get(collectionName, docId) {
      const docSnap = await getDoc(doc(firestore, collectionName, docId));
      return docSnap.exists() ? docSnap.data() : null;
    },

    // 4. Listen abrufen (optional mit einem einfachen Filter)
    async list(collectionName, filterField = null, operator = null, filterValue = null) {
      let q = collection(firestore, collectionName);
      if (filterField && operator && filterValue) {
        q = query(q, where(filterField, operator, filterValue));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  };

  // Resolve dbPromise for any queued calls
  if (typeof window._resolveDb === 'function') {
    window._resolveDb(realDb);
  }
  // Assign to window.db to override the Proxy wrapper
  window.db = realDb;
} catch (e) {
  console.error("Failed to initialize Firebase:", e);
}
