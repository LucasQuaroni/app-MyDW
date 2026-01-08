import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAppSelector } from "../../hooks/redux";
import { selectUser } from "../../features/auth/authSlice";
import { api } from "../../config/axios";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
  Shield,
} from "lucide-react";

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
      <div className="min-h-[60vh] flex items-center justify-center py-12 md:py-16">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500/20 border-t-orange-500 mx-auto"></div>
            <UserCircle className="absolute inset-0 m-auto w-8 h-8 text-orange-500 animate-pulse" />
          </div>
          <p className="text-white text-lg md:text-xl font-medium">
            Cargando tu perfil...
          </p>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Estamos preparando tu información
          </p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12 md:py-16 px-4">
        <div className="bg-red-900/30 border border-red-800/50 text-red-300 px-6 py-6 md:py-8 rounded-2xl text-center max-w-md backdrop-blur-sm">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl md:text-2xl font-bold mb-2">Error al cargar</h2>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
      {/* Header Section */}
      <div className="mb-6 md:mb-10">
        <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 md:px-5 md:py-2.5 bg-orange-500/10 text-orange-400 rounded-full text-sm md:text-base font-medium border border-orange-500/20 backdrop-blur-sm">
          <UserCircle className="w-4 h-4 md:w-5 md:h-5" />
          <span>Mi Perfil</span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4 leading-tight">
          <span className="block mb-2">Gestiona tu información</span>
          <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            de contacto
          </span>
        </h1>

        <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl">
          Mantén tu información actualizada para que las personas puedan contactarte
          fácilmente si encuentran a tu mascota perdida.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-900/30 border border-green-800/50 text-green-300 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center gap-3 backdrop-blur-sm">
          <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-green-400" />
          <div>
            <p className="font-semibold text-sm md:text-base">{successMessage}</p>
            <p className="text-xs md:text-sm text-green-200 mt-0.5">
              Los cambios se han guardado correctamente
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && profile && (
        <div className="mb-6 bg-red-900/30 border border-red-800/50 text-red-300 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center gap-3 backdrop-blur-sm">
          <AlertCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-red-400" />
          <div>
            <p className="font-semibold text-sm md:text-base">Error al guardar</p>
            <p className="text-xs md:text-sm text-red-200 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-700/50 shadow-xl overflow-hidden">
        {/* Account Info Section */}
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-5 md:p-6 lg:p-8 border-b border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <UserCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                <Shield className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Información de Cuenta
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                  <p className="text-sm md:text-base break-all">{profile?.email}</p>
                </div>
                {profile?.name && profile?.lastname && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <UserCircle className="w-4 h-4 text-gray-500" />
                    <p className="text-sm md:text-base">
                      {profile.name} {profile.lastname}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleFormSubmit(onSubmit)} className="p-5 md:p-6 lg:p-8 space-y-5 md:space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm md:text-base font-semibold text-gray-200 mb-2"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm md:text-base"
                placeholder="Tu nombre"
              />
              {errors.name && (
                <p className="text-red-400 text-xs md:text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="lastname"
                className="block text-sm md:text-base font-semibold text-gray-200 mb-2"
              >
                Apellido
              </label>
              <input
                type="text"
                id="lastname"
                {...register("lastname")}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm md:text-base"
                placeholder="Tu apellido"
              />
              {errors.lastname && (
                <p className="text-red-400 text-xs md:text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.lastname.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm md:text-base font-semibold text-gray-200 mb-2"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                <span>Número de Teléfono</span>
              </div>
            </label>
            <input
              type="tel"
              id="phone"
              {...register("phone")}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm md:text-base"
              placeholder="Ej: +54 341 277 6893"
            />
            {errors.phone && (
              <p className="text-red-400 text-xs md:text-sm mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <label
              htmlFor="address"
              className="block text-sm md:text-base font-semibold text-gray-200 mb-2"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                <span>Dirección</span>
              </div>
            </label>
            <textarea
              id="address"
              {...register("address")}
              rows={3}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none text-sm md:text-base"
              placeholder="Ej: Av. Corrientes 1234, CABA, Argentina"
            />
            {errors.address && (
              <p className="text-red-400 text-xs md:text-sm mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-br from-orange-900/20 to-amber-900/20 border border-orange-700/50 rounded-xl md:rounded-2xl p-4 md:p-5">
            <div className="flex gap-3 md:gap-4">
              <div className="shrink-0 mt-0.5">
                <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/20">
                  <Info className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-base font-semibold text-orange-300 mb-2">
                  ¿Por qué necesitamos esta información?
                </h3>
                <p className="text-xs md:text-sm text-orange-200/90 leading-relaxed">
                  Cuando marques una mascota como perdida, esta información se
                  mostrará públicamente en las tarjetas de mascotas perdidas junto con tu email.
                  Esto permite que quien encuentre a tu mascota pueda contactarte fácilmente por
                  varios medios y así aumentar las posibilidades de reunirte con tu familia.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 md:pt-6 border-t border-gray-700/50">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 transition-all duration-200 shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm md:text-base"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Guardar Cambios</span>
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
