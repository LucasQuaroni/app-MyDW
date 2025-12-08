import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAppSelector } from "../../hooks/redux";
import { selectUser } from "../../features/auth/authSlice";
import { api } from "../../config/axios";
import { UserCircle, Mail, Phone, MapPin, Save, Loader2 } from "lucide-react";

interface UserProfile {
  _id: string;
  email: string;
  name?: string;
  lastname?: string;
  phone?: string;
  address?: string;
}

type ProfileFormData = {
  name: string;
  lastname: string;
  phone: string;
  address: string;
};

// Validation schema
const profileSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .min(2)
    .max(50)
    .allow("")
    .messages({
      "string.pattern.base": "El nombre solo puede contener letras y espacios",
      "string.min": "El nombre debe tener al menos 2 caracteres",
      "string.max": "El nombre no puede exceder 50 caracteres",
    }),
  lastname: Joi.string()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .min(2)
    .max(50)
    .allow("")
    .messages({
      "string.pattern.base": "El apellido solo puede contener letras y espacios",
      "string.min": "El apellido debe tener al menos 2 caracteres",
      "string.max": "El apellido no puede exceder 50 caracteres",
    }),
  phone: Joi.string()
    .pattern(/^[\d\s\-\+\(\)]+$/)
    .min(8)
    .max(20)
    .allow("")
    .messages({
      "string.pattern.base": "El teléfono solo puede contener números, espacios, guiones, + y paréntesis",
      "string.min": "El teléfono debe tener al menos 8 caracteres",
      "string.max": "El teléfono no puede exceder 20 caracteres",
    }),
  address: Joi.string()
    .min(5)
    .max(200)
    .allow("")
    .messages({
      "string.min": "La dirección debe tener al menos 5 caracteres",
      "string.max": "La dirección no puede exceder 200 caracteres",
    }),
});

const Profile = () => {
  const user = useAppSelector(selectUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: joiResolver(profileSchema),
    defaultValues: {
      name: "",
      lastname: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const response = await api.get(`/users/${user.uid}`);
        setProfile(response.data);
        reset({
          name: response.data.name || "",
          lastname: response.data.lastname || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
        });
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setError("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.uid, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.uid) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      await api.patch(`/users/${user.uid}`, data);

      setSuccessMessage("Perfil actualizado correctamente");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error updating profile:", error);

      let errorMessage = "Error al actualizar el perfil";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.details) {
        errorMessage = Array.isArray(error.response.data.details)
          ? error.response.data.details.join(", ")
          : error.response.data.details;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-800 text-red-300 px-6 py-4 rounded-2xl text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">⚠️ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Mi Perfil</h1>
        <p className="text-gray-400">
          Actualiza tu información de contacto para que aparezca en las cards de
          tus mascotas perdidas
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-900/30 border border-green-800 text-green-300 px-6 py-4 rounded-2xl flex items-center gap-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && profile && (
        <div className="mb-6 bg-red-900/30 border border-red-800 text-red-300 px-6 py-4 rounded-2xl">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
        {/* Account Info Section */}
        <div className="bg-gray-900/50 p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <UserCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100">
                Información de Cuenta
              </h2>
              <div className="flex items-center gap-2 text-gray-400 mt-1">
                <Mail className="w-4 h-4" />
                <p className="text-sm">{profile?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleFormSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Ingresa tu nombre"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Apellido
              </label>
              <input
                type="text"
                id="lastname"
                {...register("lastname")}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Ingresa tu apellido"
              />
              {errors.lastname && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.lastname.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Número de Celular
              </div>
            </label>
            <input
              type="tel"
              id="phone"
              {...register("phone")}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Ej: +54 9 11 1234-5678"
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dirección
              </div>
            </label>
            <textarea
              id="address"
              {...register("address")}
              rows={3}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              placeholder="Ej: Av. Corrientes 1234, CABA, Argentina"
            />
            {errors.address && (
              <p className="text-red-400 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="shrink-0">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-300 mb-1">
                  ¿Por qué necesitamos esta información?
                </h3>
                <p className="text-xs text-blue-200/80">
                  Cuando marques una mascota como perdida, esta información se
                  mostrará en las cards públicas junto con tu email. Esto
                  permite que quien encuentre a tu mascota pueda contactarte
                  fácilmente por varios medios.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
