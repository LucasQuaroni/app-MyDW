import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { api } from "../../config/axios";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { ImageUpload } from "../../components/ImageUpload";
import { updatePet } from "../../features/pets/petsSlice";

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
  const [loadingPet, setLoadingPet] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = useAppSelector((state) => state.auth.user);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [petData, setPetData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: joiResolver(petSchema),
  });

  useEffect(() => {
    const loadPetData = async () => {
      try {
        setLoadingPet(true);
        const response = await api.get(`/pets/${id}`);
        const pet = response.data;
        setPetData(pet);

        // Formatear la fecha de nacimiento para el input date
        const birthDate = new Date(pet.birthDate);
        const formattedDate = birthDate.toISOString().split('T')[0];

        reset({
          name: pet.name,
          description: pet.description,
          birthDate: formattedDate,
          gender: pet.gender,
          breed: pet.breed,
          isCastrated: pet.isCastrated,
          medicalInformation: pet.medicalInformation || "",
          temperament: pet.temperament || "",
        });

        setPhotoUrls(pet.photos || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar la mascota");
      } finally {
        setLoadingPet(false);
      }
    };

    if (id) {
      loadPetData();
    }
  }, [id, reset]);

  const handleImageUploaded = (url: string) => {
    // Replace existing image with new one (only one image allowed)
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
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <p className="text-gray-400">Cargando mascota...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          to="/dashboard"
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
          Volver al Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          Editar Mascota
        </h1>
        <p className="text-gray-400">
          Actualiza la información de {petData?.name}
        </p>
      </div>

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
              petName={petData?.name || "pet"}
              maxImages={1}
              currentImages={photoUrls}
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-600 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Actualizando..." : "Actualizar Mascota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPet;

