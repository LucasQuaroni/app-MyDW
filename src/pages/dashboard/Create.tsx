import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { ImageUpload } from "../../components/ImageUpload";
import { createPet, clearPetMessages } from "../../features/pets/petsSlice";
import { CreatePetData } from "../../types/PetsType";

// Helper functions to get user-scoped storage keys
const getFormStorageKey = (userId: string) =>
  `pet-registration-form-draft-${userId}`;
const getSessionFlagKey = (userId: string) =>
  `pet-registration-session-active-${userId}`;

const petSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "El nombre es requerido",
    "any.required": "El nombre es requerido",
  }),
  description: Joi.string().required().messages({
    "string.empty": "La descripción es requerida",
    "any.required": "La descripción es requerida",
  }),
  birthDate: Joi.string().required().messages({
    "string.empty": "La fecha de nacimiento es requerida",
    "any.required": "La fecha de nacimiento es requerida",
  }),
  gender: Joi.string().valid("macho", "hembra").required().messages({
    "string.empty": "El género es requerido",
    "any.required": "El género es requerido",
    "any.only": "Selecciona un género válido",
  }),
  breed: Joi.string().required().messages({
    "string.empty": "La raza es requerida",
    "any.required": "La raza es requerida",
  }),
  isCastrated: Joi.boolean().default(false),
  medicalInformation: Joi.string().allow("", null).optional(),
  temperament: Joi.string().allow("", null).optional(),
});

type PetFormData = {
  name: string;
  description: string;
  birthDate: string;
  gender: string;
  breed: string;
  isCastrated: boolean;
  medicalInformation?: string;
  temperament?: string;
};

const FORM_DEFAULT_VALUES = {
  name: "",
  description: "",
  birthDate: "",
  gender: "",
  breed: "",
  isCastrated: false,
  medicalInformation: "",
  temperament: "",
};

const Create = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.pets);
  const user = useAppSelector((state) => state.auth.user);

  const redirectTo = (location.state as any)?.redirectTo;
  const fromTagActivation = (location.state as any)?.fromTagActivation;

  const FORM_STORAGE_KEY = user ? getFormStorageKey(user.uid) : null;
  const SESSION_FLAG_KEY = user ? getSessionFlagKey(user.uid) : null;

  useEffect(() => {
    dispatch(clearPetMessages());
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    const currentUserId = user.uid;
    const keysToCheck = Object.keys(localStorage);

    keysToCheck.forEach((key) => {
      if (
        key.startsWith("pet-registration-form-draft-") &&
        !key.includes(currentUserId)
      ) {
        localStorage.removeItem(key);
      }
    });

    const sessionKeysToCheck = Object.keys(sessionStorage);
    sessionKeysToCheck.forEach((key) => {
      if (
        key.startsWith("pet-registration-session-active-") &&
        !key.includes(currentUserId)
      ) {
        sessionStorage.removeItem(key);
      }
    });
  }, [user]);

  const loadSavedFormData = () => {
    if (!FORM_STORAGE_KEY) return null;

    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userId === user?.uid) {
          return parsed;
        } else {
          localStorage.removeItem(FORM_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading saved form data:", error);
      if (FORM_STORAGE_KEY) {
        localStorage.removeItem(FORM_STORAGE_KEY);
      }
    }
    return null;
  };

  const savedData = loadSavedFormData();

  const hasUserEditedInThisSession = useRef(false);

  const [isReturningSession, setIsReturningSession] = useState(false);

  useEffect(() => {
    if (!SESSION_FLAG_KEY) return;

    sessionStorage.removeItem(SESSION_FLAG_KEY);

    if (savedData) {
      setIsReturningSession(true);
    }
  }, []);

  const [photoUrls, setPhotoUrls] = useState<string[]>(
    savedData?.photoUrls || []
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: joiResolver(petSchema),
    defaultValues: {
      name: savedData?.formData?.name || "",
      description: savedData?.formData?.description || "",
      birthDate: savedData?.formData?.birthDate || "",
      gender: savedData?.formData?.gender || "",
      breed: savedData?.formData?.breed || "",
      isCastrated: savedData?.formData?.isCastrated || false,
      medicalInformation: savedData?.formData?.medicalInformation || "",
      temperament: savedData?.formData?.temperament || "",
    },
  });

  const formData = watch();

  useEffect(() => {
    if (!FORM_STORAGE_KEY || !user) return;

    const hasFormData =
      formData.name ||
      formData.description ||
      formData.birthDate ||
      formData.gender ||
      formData.breed ||
      formData.medicalInformation ||
      formData.temperament;

    const hasPhotos = photoUrls.length > 0;

    if (hasFormData || hasPhotos) {
      const dataToSave = {
        userId: user.uid,
        formData,
        photoUrls,
        timestamp: Date.now(),
      };
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData, photoUrls, FORM_STORAGE_KEY, user]);

  useEffect(() => {
    if (!SESSION_FLAG_KEY) return;

    const subscription = watch(() => {
      if (!hasUserEditedInThisSession.current) {
        hasUserEditedInThisSession.current = true;
        sessionStorage.setItem(SESSION_FLAG_KEY, "true");
        setIsReturningSession(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, SESSION_FLAG_KEY]);

  const handleImageUploaded = (url: string) => {
    if (!hasUserEditedInThisSession.current && SESSION_FLAG_KEY) {
      hasUserEditedInThisSession.current = true;
      sessionStorage.setItem(SESSION_FLAG_KEY, "true");
      setIsReturningSession(false);
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
      reset(FORM_DEFAULT_VALUES);
      setPhotoUrls([]);
      if (FORM_STORAGE_KEY) localStorage.removeItem(FORM_STORAGE_KEY);
      if (SESSION_FLAG_KEY) sessionStorage.removeItem(SESSION_FLAG_KEY);
      setIsReturningSession(false);
      hasUserEditedInThisSession.current = false;
    }
  };

  const shouldShowRestoredBanner = () => {
    if (!savedData || !isReturningSession) return false;

    const { formData: saved, photoUrls: savedPhotos } = savedData;

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

  const onSubmit = async (data: PetFormData) => {
    try {
      if (!user) {
        return;
      }

      const petData: CreatePetData = {
        ownerId: user.uid,
        name: data.name,
        description: data.description,
        birthDate: data.birthDate,
        gender: data.gender,
        breed: data.breed,
        isCastrated: data.isCastrated,
        photos: photoUrls,
      };

      if (data.medicalInformation && data.medicalInformation.trim()) {
        petData.medicalInformation = data.medicalInformation;
      }

      if (data.temperament && data.temperament.trim()) {
        petData.temperament = data.temperament;
      }

      await dispatch(createPet(petData)).unwrap();

      reset(FORM_DEFAULT_VALUES);
      setPhotoUrls([]);
      if (FORM_STORAGE_KEY) localStorage.removeItem(FORM_STORAGE_KEY);
      if (SESSION_FLAG_KEY) sessionStorage.removeItem(SESSION_FLAG_KEY);

      setTimeout(() => {
        const destination =
          fromTagActivation && redirectTo ? redirectTo : "/dashboard";
        navigate(destination);
      }, 1500);
    } catch (err: any) {
      console.error("Error creating pet:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
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

      <div className="bg-gray-800 rounded-3xl shadow-md p-6 border border-gray-700">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">
              Información Básica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500"
                  placeholder="Ej: Max, Luna, Rocky"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="breed"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Raza <span className="text-red-500">*</span>
                </label>
                <input
                  id="breed"
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500"
                  placeholder="Ej: Labrador, Persa, Mixto"
                  {...register("breed")}
                />
                {errors.breed && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.breed.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  id="birthDate"
                  type="date"
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100"
                  {...register("birthDate")}
                />
                {errors.birthDate && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Género <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100"
                  {...register("gender")}
                >
                  <option value="">Selecciona un género</option>
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                </select>
                {errors.gender && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500 resize-none"
                placeholder="Descripción general de la mascota"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="isCastrated"
                type="checkbox"
                className="w-5 h-5 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-orange-500 text-orange-500"
                {...register("isCastrated")}
              />
              <label
                htmlFor="isCastrated"
                className="ml-3 text-sm font-medium text-gray-300"
              >
                ¿Está castrado/esterilizado?
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">
              Información Adicional (Opcional)
            </h2>

            <div>
              <label
                htmlFor="temperament"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Temperamento
              </label>
              <input
                id="temperament"
                type="text"
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500"
                placeholder="Ej: Juguetón, tranquilo, enérgico"
                {...register("temperament")}
              />
            </div>

            <div>
              <label
                htmlFor="medicalInformation"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Información Médica
              </label>
              <textarea
                id="medicalInformation"
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500 resize-none"
                placeholder="Alergias, vacunas, condiciones especiales, etc."
                {...register("medicalInformation")}
              />
            </div>

            <ImageUpload
              onImageUploaded={handleImageUploaded}
              petName={formData.name || "pet"}
              maxImages={1}
              currentImages={photoUrls}
              onUploadingChange={setUploadingImage}
            />
          </div>

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
              disabled={loading || uploadingImage}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {uploadingImage
                ? "Subiendo imagen..."
                : loading
                ? "Registrando..."
                : "Registrar Mascota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
