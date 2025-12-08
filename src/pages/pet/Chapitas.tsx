import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

const Chapitas = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-700">
          {/* Icon */}
          <div className="w-20 h-20 md:w-24 md:h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 md:w-12 md:h-12 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 text-center mb-4">
            🏷️ E-patitas Chapitas
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-center text-lg mb-8">
            Protege a tu mascota con nuestra chapita inteligente con código QR
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-100 font-semibold">
                  Código QR único e intransferible
                </h3>
                <p className="text-gray-400 text-sm">
                  Cada chapita tiene un código único que vincula con el perfil de tu mascota
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-100 font-semibold">
                  Perfil público con tus datos de contacto
                </h3>
                <p className="text-gray-400 text-sm">
                  Quien encuentre a tu mascota podrá contactarte de inmediato
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-100 font-semibold">
                  Material duradero y resistente al agua
                </h3>
                <p className="text-gray-400 text-sm">
                  Fabricada con materiales de alta calidad para uso diario
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-100 font-semibold">
                  Activación instantánea y fácil
                </h3>
                <p className="text-gray-400 text-sm">
                  Solo escanea el QR y vincula con tu mascota en segundos
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-orange-900/20 border border-orange-700 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-orange-400 mb-3 text-center">
              ¿Cómo obtener tu chapita?
            </h3>
            <p className="text-gray-300 text-center mb-4">
              Contáctanos para adquirir tu chapita E-patitas y proteger a tu mascota hoy mismo
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center py-3 px-6 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 transition-all shadow-md hover:shadow-lg"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contactar para Comprar
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center py-3 px-6 rounded-xl text-sm font-semibold border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-600 transition-all"
                >
                  Volver al Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Info Message */}
          {!user && (
            <div className="bg-blue-900/20 border border-blue-700 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-blue-400"
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
                <div>
                  <p className="text-blue-400 text-sm">
                    <span className="font-semibold">Nota:</span> Necesitas{" "}
                    <Link
                      to="/register"
                      className="underline hover:text-blue-300"
                    >
                      crear una cuenta
                    </Link>{" "}
                    en E-patitas para poder registrar tus mascotas y vincularlas con la chapita.
                  </p>
                </div>
              </div>
            </div>
          )}

          {user && (
            <div className="bg-green-900/20 border border-green-700 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-green-400 text-sm">
                    Ya tienes una cuenta. Una vez que obtengas tu chapita, podrás activarla escaneando el código QR y vinculándola con tu mascota.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chapitas;

