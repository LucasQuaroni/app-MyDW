import { Link } from "react-router-dom";
import { useAppSelector } from "./hooks/redux";

function App() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-block">
          <span className="bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full text-sm font-medium border border-orange-500/20">
            Sistema de Identificación Inteligente
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
          Reúnete con tu mascota
          <br />
          <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            más rápido que nunca
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          E-Patitas es un sistema integral diseñado para la identificación y
          localización de mascotas extraviadas mediante placas inteligentes con
          código QR.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Ir al Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Comenzar Ahora
              </Link>
              <Link
                to="/login"
                className="border-2 border-gray-700 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:border-orange-500 hover:text-orange-400 transition-all duration-200"
              >
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Problem Statement */}
      <section className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-700">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-orange-500/10 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Un problema que afecta a millones
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                <span className="text-orange-400 font-semibold">
                  Uno de cada tres animales domésticos se pierde al menos una
                  vez en su vida.
                </span>{" "}
                Los métodos tradicionales como carteles o publicaciones en redes
                sociales resultan lentos e ineficaces, causando altos niveles de
                estrés y angustia en los dueños.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          ¿Cómo funciona E-Patitas?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="bg-orange-500/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Placa Inteligente QR
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Cada mascota recibe una placa con código QR único que cualquier
              persona puede escanear para acceder a la información de contacto.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="bg-orange-500/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Conexión Instantánea
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Al escanear el QR, quien encuentre la mascota accede
              inmediatamente a una plataforma web con los datos del dueño.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="bg-orange-500/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Reencuentro Rápido
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Acelera significativamente el tiempo de búsqueda y aumenta las
              posibilidades de que las mascotas se reúnan con sus dueños.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-8 md:p-12 rounded-2xl border border-orange-500/20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Impacto Social Positivo
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              E-Patitas no solo ofrece tecnología moderna y accesible, sino que
              brinda{" "}
              <span className="text-orange-400 font-semibold">
                tranquilidad y seguridad
              </span>{" "}
              para un miembro de tu familia. Porque sabemos que tu mascota es
              más que un animal, es parte de tu vida.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="text-center py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          ¿Listo para proteger a tu mascota?
        </h2>
        {user ? (
          <Link
            to="/dashboard"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-10 py-5 rounded-lg text-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Gestionar mis Mascotas
          </Link>
        ) : (
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-10 py-5 rounded-lg text-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Crear mi Cuenta Gratis
          </Link>
        )}
      </section>
    </div>
  );
}

export default App;
