import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { loginUser, loginWithGoogle } from "../features/auth/authSlice";
import { Mail, Lock, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "El correo electrónico es requerido",
      "string.email": "Debe ser un correo electrónico válido",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "La contraseña es requerida",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
  }),
});

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const redirectTo = (location.state as any)?.redirectTo || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: joiResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate(redirectTo);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await dispatch(loginWithGoogle()).unwrap();
      navigate(redirectTo);
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Logo with glow effect */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-4 flex items-center justify-center border border-gray-700/50 group-hover:border-orange-500/50 transition-all duration-300">
                <img
                  src="/Logo.svg"
                  alt="Logo"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
            </div>
          </div>

          {/* Welcome text */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-medium text-orange-400">Bienvenido de vuelta</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Inicia sesión
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Accede a tu cuenta para gestionar tus mascotas
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative">
          {/* Card glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-50" />
          
          <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Correo electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 transition-colors duration-200 ${
                      errors.email ? "text-red-400" : "text-gray-500 group-focus-within:text-orange-400"
                    }`} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-900/80 border-2 ${
                      errors.email 
                        ? "border-red-500/50 focus:border-red-500" 
                        : "border-gray-700/50 focus:border-orange-500/70 hover:border-gray-600"
                    } rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 text-gray-100 placeholder-gray-500 text-sm`}
                    placeholder="tunombre@ejemplo.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Contraseña
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors duration-200 ${
                      errors.password ? "text-red-400" : "text-gray-500 group-focus-within:text-orange-400"
                    }`} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-900/80 border-2 ${
                      errors.password 
                        ? "border-red-500/50 focus:border-red-500" 
                        : "border-gray-700/50 focus:border-orange-500/70 hover:border-gray-600"
                    } rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 text-gray-100 placeholder-gray-500 text-sm`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:from-orange-400 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-orange-500/25 transition-all duration-300 overflow-hidden"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar sesión</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700/50" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-gray-800/80 text-xs text-gray-500 uppercase tracking-wider">
                    o continúa con
                  </span>
                </div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group w-full inline-flex justify-center items-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-gray-700/50 hover:border-gray-600 rounded-xl text-sm font-medium text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#4285F4"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 pt-6 border-t border-gray-700/50 text-center">
              <p className="text-sm text-gray-400">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  state={{ redirectTo }}
                  className="font-semibold text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1 group"
                >
                  Regístrate gratis
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
