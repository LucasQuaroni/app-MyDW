import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-500 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-orange-500/5 animate-ping"></div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            ¡Ups! Página no encontrada
          </h2>
          <p className="text-lg text-gray-400 max-w-md mx-auto">
            Parece que te has perdido. Esta página no existe o ha sido movida a
            otra ubicación.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            to="/"
            className="bg-linear-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl text-base font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Volver al Inicio
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="border-2 border-gray-700 text-gray-300 px-8 py-3 rounded-xl text-base font-semibold hover:border-orange-500 hover:text-orange-400 transition-all duration-200 inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Página Anterior
          </button>
        </div>

        <div className="pt-8">
          <p className="text-gray-500 text-sm mb-4">O visita:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/lost-pets"
              className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
            >
              Mascotas Perdidas
            </Link>
            <span className="text-gray-700">•</span>
            <Link
              to="/pet/chapitas"
              className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
            >
              Chapitas
            </Link>
            <span className="text-gray-700">•</span>
            <Link
              to="/about"
              className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
            >
              Acerca de
            </Link>
            <span className="text-gray-700">•</span>
            <Link
              to="/contact"
              className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
            >
              Contacto
            </Link>
          </div>
        </div>

        <div className="pt-8">
          <Link to="/" className="inline-block group">
            <div className="w-20 h-20 bg-gray-800 rounded-2xl shadow-lg p-4 flex items-center justify-center border border-gray-700 transition-all duration-300 group-hover:border-orange-500 group-hover:shadow-xl group-hover:shadow-orange-500/20">
              <img
                src="/Logo.svg"
                alt="Logo"
                className="w-full h-full object-contain transition-all duration-300"
                style={{
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
