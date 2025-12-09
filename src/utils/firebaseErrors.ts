export const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "Este correo electrónico ya está registrado. Por favor inicia sesión o usa otro correo.",
    "auth/invalid-email": "El formato del correo electrónico no es válido",
    "auth/operation-not-allowed": "El registro con correo y contraseña no está habilitado. Contacta al administrador.",
    "auth/weak-password": "La contraseña es muy débil. Debe tener al menos 6 caracteres",
    "auth/user-disabled": "Esta cuenta ha sido deshabilitada. Contacta al administrador.",
    "auth/user-not-found": "No existe una cuenta con este correo electrónico",
    "auth/wrong-password": "La contraseña es incorrecta",
    "auth/invalid-credential": "Las credenciales proporcionadas no son válidas",
    "auth/too-many-requests": "Demasiados intentos fallidos. Por favor intenta más tarde.",
    "auth/network-request-failed": "Error de conexión. Verifica tu conexión a internet.",
    "auth/popup-closed-by-user": "La ventana de inicio de sesión fue cerrada antes de completar el proceso",
    "auth/cancelled-popup-request": "Solo se puede abrir una ventana de inicio de sesión a la vez",
    "auth/popup-blocked": "La ventana emergente fue bloqueada por el navegador. Por favor permite ventanas emergentes para este sitio.",
    "auth/account-exists-with-different-credential": "Ya existe una cuenta con este correo usando un método de inicio de sesión diferente",
    "auth/invalid-password": "La contraseña no es válida. Debe tener al menos 6 caracteres",
    "auth/requires-recent-login": "Esta operación requiere que inicies sesión nuevamente",
  };

  return errorMessages[errorCode] || "Ocurrió un error inesperado. Por favor intenta de nuevo.";
};

export const extractErrorCode = (error: any): string | null => {
  if (error?.code) {
    return error.code;
  }
  if (error?.message && error.message.includes("auth/")) {
    const match = error.message.match(/auth\/[\w-]+/);
    return match ? match[0] : null;
  }
  return null;
};

