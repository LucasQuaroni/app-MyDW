import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

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
 * O usa variables de entorno creando un archivo .env en la raíz de app-MyDW/
 */
const firebaseConfig = {
  apiKey: "AIzaSyBo7Do450OM8j5u9aFy8ukgda9mn6xhJQg",
  authDomain: "app-mydw.firebaseapp.com",
  projectId: "app-mydw",
  storageBucket: "app-mydw.firebasestorage.app",
  messagingSenderId: "322500738959",
  appId: "1:322500738959:web:fb297596995187011fd5fa",
  measurementId: "G-2B88P0CHXB",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);

// Configurar persistencia para mantener la sesión después de refrescar
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export default app;
