import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { ImageUpload } from "../../components/ImageUpload";
import {
  updatePet,
  fetchPetById,
  clearCurrentPet,
} from "../../features/pets/petsSlice";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Edit as EditIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

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

const EditPet = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const currentPet = useAppSelector((state) => state.pets.currentPet);
  const loadingPet = useAppSelector((state) => state.pets.currentPetLoading);
  const petError = useAppSelector((state) => state.pets.currentPetError);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: joiResolver(petSchema),
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchPetById(id));
    }

    return () => {
      dispatch(clearCurrentPet());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentPet) {
      const birthDate = new Date(currentPet.birthDate);
      const formattedDate = birthDate.toISOString().split("T")[0];

      reset({
        name: currentPet.name,
        description: currentPet.description,
        birthDate: formattedDate,
        gender: currentPet.gender,
        breed: currentPet.breed,
        isCastrated: currentPet.isCastrated,
        medicalInformation: currentPet.medicalInformation || "",
        temperament: currentPet.temperament || "",
      });

      setPhotoUrls(currentPet.photos || []);
    }
  }, [currentPet, reset]);

  useEffect(() => {
    if (petError) {
      setError(petError);
    }
  }, [petError]);

  const handleImageUploaded = (url: string) => {
    setPhotoUrls([url]);
  };

  const onSubmit = async (data: PetFormData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const updateData: any = {
        name: data.name,
        description: data.description,
        birthDate: data.birthDate,
        gender: data.gender,
        breed: data.breed,
        isCastrated: data.isCastrated,
        photos: photoUrls,
      };

      if (data.medicalInformation && data.medicalInformation.trim()) {
        updateData.medicalInformation = data.medicalInformation;
      }
      if (data.temperament && data.temperament.trim()) {
        updateData.temperament = data.temperament;
      }

      await dispatch(updatePet({ id: id!, data: updateData })).unwrap();
      setSuccess("¡Mascota actualizada exitosamente!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err || "Error al actualizar la mascota");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPet) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 pb-8">
        <div className="text-center py-16 md:py-24">
          <div className="relative inline-block mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500/20 border-t-orange-500 mx-auto"></div>
            <EditIcon className="absolute inset-0 m-auto w-8 h-8 text-orange-500 animate-pulse" />
          </div>
          <p className="text-white text-lg md:text-xl font-medium">
            Cargando información de la mascota...
          </p>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Estamos preparando el formulario de edición
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-8">
      {/* Header - Mobile First */}
      <div className="mb-6 md:mb-8">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4 md:mb-6 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all duration-200"
        >
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
        </Button>
        <div>
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 md:px-5 md:py-2.5 bg-orange-500/10 text-orange-400 rounded-full text-sm md:text-base font-medium border border-orange-500/20 backdrop-blur-sm">
            <EditIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span>Editar Mascota</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 leading-tight">
            <span className="block mb-2">Actualiza la información de</span>
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              {currentPet?.name || "tu mascota"}
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed">
            Modifica los datos de tu mascota y guarda los cambios
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Error/Success Messages */}
        {error && (
          <Card className="border-red-700/50 bg-red-900/20">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm md:text-base text-red-300 font-semibold">
                    Error al actualizar
                  </p>
                  <p className="text-xs md:text-sm text-red-200 mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="border-green-700/50 bg-green-900/20">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm md:text-base text-green-300 font-semibold">
                    {success}
                  </p>
                  <p className="text-xs md:text-sm text-green-200 mt-1">
                    Redirigiendo al dashboard...
                  </p>
                </div>
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
                petName={currentPet?.name || "pet"}
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
            onClick={() => navigate("/dashboard")}
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
                <span>Actualizando...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                <span>Actualizar Mascota</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPet;
