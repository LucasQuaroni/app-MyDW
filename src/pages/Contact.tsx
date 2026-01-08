import {
  Mail,
  MessageSquare,
  Clock,
  HelpCircle,
} from "lucide-react";

const Contact = () => {

  const formatPhone = (phone: string) => {
    // Format: +54 341 277 6893
    // Remove any non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, "");
    // Remove +54 prefix for formatting
    const number = cleaned.replace(/^\+54/, "");
    return `+54 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
  };

  return (
    <div className="min-h-screen py-6 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 md:px-5 md:py-2.5 bg-orange-500/10 text-orange-400 rounded-full text-sm md:text-base font-medium border border-orange-500/20 backdrop-blur-sm">
            <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
            <span>Contacto</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight px-2">
            <span className="block mb-2">Estamos aquí para ayudarte</span>
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Tu opinión nos importa
            </span>
          </h1>

          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
            ¿Tienes preguntas, sugerencias o necesitas soporte? Nuestro equipo está
            listo para ayudarte. Respondemos en menos de 24 horas.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Contact Information Cards */}
          <div className="space-y-4 md:space-y-6">
            {/* Email Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 md:p-6 hover:border-orange-500/50 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                    Email
                  </h3>
                  <a
                    href="mailto:hola@epatitas.com"
                    className="text-sm md:text-base text-orange-400 hover:text-orange-300 break-all transition-colors"
                  >
                    hola@epatitas.com
                  </a>
                  <p className="text-xs md:text-sm text-gray-400 mt-2">
                    Respuesta en menos de 24h
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 md:p-6 hover:border-green-500/50 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                    WhatsApp
                  </h3>
                  <a
                    href="https://wa.me/543412776893"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base text-green-400 hover:text-green-300 transition-colors inline-flex items-center gap-1"
                  >
                    {formatPhone("543412776893")}
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </a>
                  <p className="text-xs md:text-sm text-gray-400 mt-2">
                    Escríbenos por WhatsApp
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-gradient-to-br from-orange-900/20 to-amber-900/20 border border-orange-700/50 rounded-2xl p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/20 p-3 rounded-xl">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                    Tiempo de respuesta
                  </h3>
                  <p className="text-sm md:text-base text-gray-300">
                    <span className="text-orange-400 font-semibold">
                      Menos de 24 horas
                    </span>{" "}
                    en días hábiles
                  </p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 md:p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-white mb-2">
                    ¿Necesitas ayuda urgente?
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                    Si tu mascota está perdida, visita nuestra sección de{" "}
                    <a
                      href="/lost-pets"
                      className="text-orange-400 hover:text-orange-300 underline"
                    >
                      mascotas perdidas
                    </a>{" "}
                    para reportarla inmediatamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;