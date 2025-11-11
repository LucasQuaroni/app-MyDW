import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api } from "../../config/axios";
import { useAppSelector } from "../../hooks/redux";
import { ImageUpload } from "../../components/ImageUpload";

const FORM_STORAGE_KEY = "pet-registration-form-draft";
const SESSION_FLAG_KEY = "pet-registration-session-active";

const Create = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = useAppSelector((state) => state.auth.user);

  const redirectTo = (location.state as any)?.redirectTo;
  const fromTagActivation = (location.state as any)?.fromTagActivation;

  // Load saved form data from localStorage on mount
  const loadSavedFormData = () => {
    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (error) {
      console.error("Error loading saved form data:", error);
    }
    return null;
  };

  const savedData = loadSavedFormData();

  // Detect if user is returning (has saved data but hasn't started editing in this mount)
  // Using useRef to track if user has made changes in THIS component mount
  const hasUserEditedInThisSession = useRef(false);

  // Use state so it triggers re-render when detected
  const [isReturningSession, setIsReturningSession] = useState(false);

  // Check on mount: if there's saved data and no active editing session flag
  useEffect(() => {
    const hasActiveSession = sessionStorage.getItem(SESSION_FLAG_KEY);

    if (savedData && !hasActiveSession) {
      // User is returning - there's saved data but no active session
      setIsReturningSession(true);
    }
  }, []); // Only run once on mount

  // State for uploaded photo URLs
  const [photoUrls, setPhotoUrls] = useState<string[]>(
    savedData?.photoUrls || []
  );

  const [formData, setFormData] = useState({
    name: savedData?.formData?.name || "",
    description: savedData?.formData?.description || "",
    birthDate: savedData?.formData?.birthDate || "",
    gender: savedData?.formData?.gender || "",
    breed: savedData?.formData?.breed || "",
    isCastrated: savedData?.formData?.isCastrated || false,
    medicalInformation: savedData?.formData?.medicalInformation || "",
    temperament: savedData?.formData?.temperament || "",
  });

  // Save form data to localStorage whenever it changes (only if there's actual data)
  useEffect(() => {
    // Check if there's any meaningful data to save
    const hasFormData =
      formData.name ||
      formData.description ||
      formData.birthDate ||
      formData.gender ||
      formData.breed ||
      formData.medicalInformation ||
      formData.temperament;

    const hasPhotos = photoUrls.length > 0;

    // Only save if there's actual data
    if (hasFormData || hasPhotos) {
      const dataToSave = {
        formData,
        photoUrls,
        timestamp: Date.now(),
      };
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData, photoUrls]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Mark session as active on first edit
    if (!hasUserEditedInThisSession.current) {
      hasUserEditedInThisSession.current = true;
      sessionStorage.setItem(SESSION_FLAG_KEY, "true");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload callback
  const handleImageUploaded = (url: string) => {
    // Mark session as active on image upload
    if (!hasUserEditedInThisSession.current) {
      hasUserEditedInThisSession.current = true;
      sessionStorage.setItem(SESSION_FLAG_KEY, "true");
    }

    setPhotoUrls((prev) => [...prev, url]);
  };

  // Clear draft manually
  const clearDraft = () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas limpiar el borrador? Se perderán todos los datos del formulario."
      )
    ) {
      setFormData({
        name: "",
        description: "",
        birthDate: "",
        gender: "",
        breed: "",
        isCastrated: false,
        medicalInformation: "",
        temperament: "",
      });
      setPhotoUrls([]);
      localStorage.removeItem(FORM_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_FLAG_KEY);
      // Clear flags
      setIsReturningSession(false);
      hasUserEditedInThisSession.current = false;
    }
  };

  // Check if we should show the "Draft Restored" banner
  // Only show if: 1) there's saved data, 2) it has content, 3) user is returning (not same session)
  const shouldShowRestoredBanner = () => {
    if (!savedData || !isReturningSession) return false;

    const { formData: saved, photoUrls: savedPhotos } = savedData;

    // Check if any field has meaningful data
    const hasFormData =
      saved?.name ||
      saved?.description ||
      saved?.birthDate ||
      saved?.gender ||
      saved?.breed ||
      saved?.medicalInformation ||
      saved?.temperament;

    const hasPhotos = savedPhotos && savedPhotos.length > 0;

    return hasFormData || hasPhotos;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const petData = {
        ownerId: user?.uid,
        ...formData,
        photos: photoUrls, // Use uploaded photo URLs
      };

      const response = await api.post("/pets", petData);
      if (response.data) {
        if (fromTagActivation) {
          setSuccess(
            "¡Mascota registrada! Redirigiendo para activar tu chapita..."
          );
        } else {
          setSuccess("¡Mascota registrada exitosamente!");
        }
      }

      // Clear form and localStorage
      setFormData({
        name: "",
        description: "",
        birthDate: "",
        gender: "",
        breed: "",
        isCastrated: false,
        medicalInformation: "",
        temperament: "",
      });
      setPhotoUrls([]); // Reset photo URLs
      localStorage.removeItem(FORM_STORAGE_KEY); // Clear saved draft
      sessionStorage.removeItem(SESSION_FLAG_KEY); // Clear session flag

      setTimeout(() => {
        if (fromTagActivation && redirectTo) {
          navigate(redirectTo);
        } else {
          navigate("/dashboard");
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al registrar la mascota");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={fromTagActivation && redirectTo ? redirectTo : "/dashboard"}
          className="inline-flex items-center text-gray-400 hover:text-orange-500 transition-colors mb-4"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {fromTagActivation ? "Volver a Activación" : "Volver al Dashboard"}
        </Link>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          Registrar Nueva Mascota
        </h1>
        <p className="text-gray-400">
          Completa el formulario para agregar una mascota a tu registro
        </p>
      </div>

      {/* Banner de borrador restaurado */}
      {shouldShowRestoredBanner() && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-2xl p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <div className="text-2xl mr-3">💾</div>
              <div>
                <h3 className="text-blue-400 font-semibold mb-1">
                  Borrador Restaurado
                </h3>
                <p className="text-gray-300 text-sm">
                  Se han recuperado los datos que ingresaste anteriormente.
                  Puedes continuar donde lo dejaste.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearDraft}
              className="text-gray-400 hover:text-red-400 transition-colors ml-4 text-sm"
              title="Limpiar borrador"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Banner de activación de chapita */}
      {fromTagActivation && (
        <div className="bg-orange-900/20 border border-orange-700 rounded-2xl p-4 mb-6">
          <div className="flex items-start">
            <div className="text-2xl mr-3">🏷️</div>
            <div>
              <h3 className="text-orange-400 font-semibold mb-1">
                Activación de Chapita
              </h3>
              <p className="text-gray-300 text-sm">
                Una vez que registres tu mascota, podrás asociarla a tu chapita
                automáticamente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div className="bg-gray-800 rounded-3xl shadow-md p-6 border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mensajes de error/éxito */}
          {error && (
            <div
              className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-2xl text-sm"
              role="alert"
            >
              <span className="block">{error}</span>
            </div>
          )}

          {success && (
            <div
              className="bg-green-900/30 border border-green-800 text-green-300 px-4 py-3 rounded-2xl text-sm"
              role="alert"
            >
              <span className="block">{success}</span>
            </div>
          )}

          {/* Información Básica */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">
              Información Básica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500"
                  placeholder="Ej: Max, Luna, Rocky"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Raza */}
              <div>
                <label
                  htmlFor="breed"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Raza <span className="text-red-500">*</span>
                </label>
                <input
                  id="breed"
                  name="breed"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500"
                  placeholder="Ej: Labrador, Persa, Mixto"
                  value={formData.breed}
                  onChange={handleChange}
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  required
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>

              {/* Género */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Género <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un género</option>
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500 resize-none"
                placeholder="Descripción general de la mascota"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Castrado/Esterilizado */}
            <div className="flex items-center">
              <input
                id="isCastrated"
                name="isCastrated"
                type="checkbox"
                className="w-5 h-5 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-orange-500 text-orange-500"
                checked={formData.isCastrated}
                onChange={handleChange}
              />
              <label
                htmlFor="isCastrated"
                className="ml-3 text-sm font-medium text-gray-300"
              >
                ¿Está castrado/esterilizado?
              </label>
            </div>
          </div>

          {/* Detalles Adicionales */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">
              Información Adicional (Opcional)
            </h2>

            {/* Temperamento */}
            <div>
              <label
                htmlFor="temperament"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Temperamento
              </label>
              <input
                id="temperament"
                name="temperament"
                type="text"
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500"
                placeholder="Ej: Juguetón, tranquilo, enérgico"
                value={formData.temperament}
                onChange={handleChange}
              />
            </div>

            {/* Información Médica */}
            <div>
              <label
                htmlFor="medicalInformation"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Información Médica
              </label>
              <textarea
                id="medicalInformation"
                name="medicalInformation"
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500 resize-none"
                placeholder="Alergias, vacunas, condiciones especiales, etc."
                value={formData.medicalInformation}
                onChange={handleChange}
              />
            </div>

            {/* Image Upload Component */}
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              petName={formData.name || "pet"}
              maxImages={1}
              currentImages={photoUrls}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() =>
                navigate(
                  fromTagActivation && redirectTo ? redirectTo : "/dashboard"
                )
              }
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-600 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Registrando..." : "Registrar Mascota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
