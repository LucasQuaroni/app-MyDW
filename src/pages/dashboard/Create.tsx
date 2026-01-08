import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { ArrowLeft, Save, X, AlertCircle, CheckCircle2, Loader2, Info } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { ImageUpload } from "../../components/ImageUpload";
import { createPet, clearPetMessages } from "../../features/pets/petsSlice";
import { CreatePetData } from "../../types/PetsType";
import ConfirmModal from "../../components/ConfirmModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

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
  const [showClearDraftModal, setShowClearDraftModal] = useState(false);

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
  const handleClearDraftClick = () => {
    setShowClearDraftModal(true);
  };

  const handleClearDraftConfirm = () => {
    reset(FORM_DEFAULT_VALUES);
    setPhotoUrls([]);
    if (FORM_STORAGE_KEY) localStorage.removeItem(FORM_STORAGE_KEY);
    if (SESSION_FLAG_KEY) sessionStorage.removeItem(SESSION_FLAG_KEY);
    setIsReturningSession(false);
    hasUserEditedInThisSession.current = false;
    setShowClearDraftModal(false);
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
    <div className="w-full max-w-4xl mx-auto px-4 pb-8">
      {/* Header - Mobile First */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all duration-200"
        >
          <Link to={fromTagActivation && redirectTo ? redirectTo : "/dashboard"}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {fromTagActivation ? "Volver a Activación" : "Volver al Dashboard"}
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">
            Registrar Nueva Mascota
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Completa el formulario para agregar una mascota a tu registro
          </p>
        </div>
      </div>

      {/* Info Banners */}
      {shouldShowRestoredBanner() && (
        <Card className="border-blue-700/50 bg-blue-900/20 mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <Save className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-blue-400 mb-1">
                    Borrador Restaurado
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Se han recuperado los datos que ingresaste anteriormente.
                    Puedes continuar donde lo dejaste.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClearDraftClick}
                className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10 shrink-0 transition-all duration-200"
                title="Limpiar borrador"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {fromTagActivation && (
        <Card className="border-orange-700/50 bg-orange-900/20 mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-orange-400 mb-1">
                  Activación de Chapita
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  Una vez que registres tu mascota, podrás asociarla a tu chapita
                  automáticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Error/Success Messages */}
        {error && (
          <Card className="border-red-700/50 bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300 flex-1">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="border-green-700/50 bg-green-900/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-green-300 flex-1">{success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Basic Information Card */}
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-100">
              Información Básica
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-400">
              Los campos marcados con <span className="text-red-500">*</span> son obligatorios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500 text-base ${
                    errors.name ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="Ej: Max, Luna, Rocky"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="breed"
                  className="block text-sm font-medium text-gray-300"
                >
                  Raza <span className="text-red-500">*</span>
                </label>
                <input
                  id="breed"
                  type="text"
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500 text-base ${
                    errors.breed ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="Ej: Labrador, Persa, Mixto"
                  {...register("breed")}
                />
                {errors.breed && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.breed.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-gray-300"
                >
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  id="birthDate"
                  type="date"
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 text-base ${
                    errors.birthDate ? "border-red-500" : "border-gray-700"
                  }`}
                  {...register("birthDate")}
                />
                {errors.birthDate && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-300"
                >
                  Género <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 text-base ${
                    errors.gender ? "border-red-500" : "border-gray-700"
                  }`}
                  {...register("gender")}
                >
                  <option value="">Selecciona un género</option>
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                </select>
                {errors.gender && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300"
              >
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500 resize-none text-base ${
                  errors.description ? "border-red-500" : "border-gray-700"
                }`}
                placeholder="Descripción general de la mascota..."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                id="isCastrated"
                type="checkbox"
                className="w-5 h-5 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-orange-500 text-orange-500 cursor-pointer"
                {...register("isCastrated")}
              />
              <label
                htmlFor="isCastrated"
                className="text-sm font-medium text-gray-300 cursor-pointer"
              >
                ¿Está castrado/esterilizado?
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Card */}
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-100">
              Información Adicional
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-400">
              Estos campos son opcionales pero ayudan a tener un registro más completo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="temperament"
                className="block text-sm font-medium text-gray-300"
              >
                Temperamento
              </label>
              <input
                id="temperament"
                type="text"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500 text-base"
                placeholder="Ej: Juguetón, tranquilo, enérgico"
                {...register("temperament")}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="medicalInformation"
                className="block text-sm font-medium text-gray-300"
              >
                Información Médica
              </label>
              <textarea
                id="medicalInformation"
                rows={4}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500 resize-none text-base"
                placeholder="Alergias, vacunas, condiciones especiales, etc."
                {...register("medicalInformation")}
              />
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-3">
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                petName={formData.name || "pet"}
                maxImages={1}
                currentImages={photoUrls}
                onUploadingChange={setUploadingImage}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-700">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() =>
              navigate(
                fromTagActivation && redirectTo ? redirectTo : "/dashboard"
              )
            }
            className="w-full sm:flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 hover:text-gray-100 font-medium"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={loading || uploadingImage}
            className="w-full sm:flex-1 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:via-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-200 disabled:shadow-md disabled:hover:shadow-md"
          >
            {uploadingImage ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Subiendo imagen...</span>
              </>
            ) : loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                <span>Registrar Mascota</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Modal de Confirmación para Limpiar Borrador */}
      <ConfirmModal
        isOpen={showClearDraftModal}
        onClose={() => setShowClearDraftModal(false)}
        onConfirm={handleClearDraftConfirm}
        title="Limpiar Borrador"
        message="¿Estás seguro de que deseas limpiar el borrador? Se perderán todos los datos del formulario."
        confirmText="Limpiar"
        cancelText="Cancelar"
        confirmButtonColor="orange"
      />
    </div>
  );
};

export default Create;
