import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { loginUser, loginWithGoogle } from "../features/auth/authSlice";

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
    <div className="flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl shadow-lg p-3 flex items-center justify-center border border-gray-700">
              <img
                src="/Logo.svg"
                alt="Logo"
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-1">Bienvenido</h2>
          <p className="text-gray-400 text-sm">Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <div className="bg-gray-800 rounded-3xl shadow-md p-6 border border-gray-700">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div
                className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-2.5 rounded-2xl text-sm"
                role="alert"
              >
                <span className="block">{error}</span>
              </div>
            )}

            <div className="space-y-3.5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={`w-full px-4 py-2.5 bg-gray-900 border ${
                    errors.email ? "border-red-500" : "border-gray-700"
                  } rounded-xl focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "focus:ring-red-500"
                      : "focus:ring-orange-500"
                  } focus:border-transparent transition-all text-gray-100 placeholder-gray-500`}
                  placeholder="tunombre@ejemplo.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`w-full px-4 py-2.5 bg-gray-900 border ${
                    errors.password ? "border-red-500" : "border-gray-700"
                  } rounded-xl focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "focus:ring-red-500"
                      : "focus:ring-orange-500"
                  } focus:border-transparent transition-all text-gray-100 placeholder-gray-500`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 rounded-xl text-sm font-semibold border-2 border-orange-500 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800 text-gray-400">
                  O continúa con
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-xl shadow-sm bg-gray-900 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="h-5 w-5 mr-2.5" viewBox="0 0 24 24">
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
              Iniciar sesión con Google
            </button>

            <div className="text-center pt-3">
              <p className="text-sm text-gray-400">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  state={{ redirectTo }}
                  className="font-semibold text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Regístrate
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
