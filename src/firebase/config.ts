import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

/**
 * Configuración de Firebase para el cliente (frontend)
 *
 * IMPORTANTE: Este archivo necesita las credenciales de la APP WEB, no del servicio admin.
 *
 * Para obtener estas credenciales:
 * 1. Ve a https://console.firebase.google.com/
 * 2. Selecciona tu proyecto "app-mydw"
 * 3. Haz clic en el ícono de configuración (⚙️) > "Configuración del proyecto"
 * 4. Baja hasta la sección "Tus aplicaciones"
 * 5. Si no tienes una app web, haz clic en "</>" (Add app > Web)
 * 6. Copia las credenciales que aparecen en el objeto firebaseConfig
 *
 * Las credenciales se cargan desde variables de entorno (archivo .env)
 * IMPORTANTE: En Vite, las variables de entorno deben tener el prefijo VITE_
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

// Validar que las variables de entorno requeridas estén presentes
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const missingVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName] || import.meta.env[varName] === ""
);

if (missingVars.length > 0) {
  console.error(
    "\n❌ Error: Faltan las siguientes variables de entorno de Firebase:"
  );
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error(
    "\n📝 Por favor, crea un archivo .env en la raíz del proyecto (app-MyDW/) con las credenciales de Firebase."
  );
  console.error(
    "   Puedes usar .env.example como referencia.\n"
  );
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);

// Configurar persistencia para mantener la sesión después de refrescar
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

// Inicializar Storage
export const storage = getStorage(app);

export default app;
