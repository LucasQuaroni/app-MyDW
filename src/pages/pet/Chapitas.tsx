import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import {
  Tag,
  CheckCircle2,
  QrCode,
  Shield,
  Droplets,
  Zap,
  Mail,
  ArrowLeft,
  Info,
  Radio,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const Chapitas = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen py-6 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 md:px-5 md:py-2.5 bg-orange-500/10 text-orange-400 rounded-full text-sm md:text-base font-medium border border-orange-500/20 backdrop-blur-sm">
            <Tag className="w-4 h-4 md:w-5 md:h-5" />
            <span>E-patitas Chapitas</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight px-2">
            <span className="inline-block">Protege a tu mascota</span>{" "}
            <span className="inline-block bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              con tecnología inteligente
            </span>
          </h1>

          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
            Nuestra chapita inteligente con código QR y tecnología NFC permite que cualquier persona que encuentre a tu mascota pueda contactarte de inmediato.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
          <Card className="border-gray-700/50 bg-gray-800/80 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                  <QrCode className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                    Código QR único e intransferible
                  </h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    Cada chapita tiene un código único que vincula con el perfil de tu mascota de forma segura
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700/50 bg-gray-800/80 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                  <Radio className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                    Tecnología NFC integrada
                  </h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    Acerca tu teléfono inteligente para acceder instantáneamente al perfil de tu mascota sin necesidad de escanear
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700/50 bg-gray-800/80 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                    Perfil público con tus datos de contacto
                  </h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    Quien encuentre a tu mascota podrá contactarte de inmediato sin necesidad de instalar apps
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700/50 bg-gray-800/80 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                  <Droplets className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                    Material duradero y resistente al agua
                  </h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    Fabricada con materiales de alta calidad para uso diario y condiciones climáticas adversas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700/50 bg-gray-800/80 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                    Activación instantánea y fácil
                  </h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    Solo escanea el QR y vincula con tu mascota en segundos. Sin complicaciones ni configuraciones complejas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-orange-700/50 bg-gradient-to-br from-orange-900/20 to-amber-900/20 mb-6 md:mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-orange-400 mb-3">
                ¿Cómo obtener tu chapita?
              </h3>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Contáctanos para adquirir tu chapita E-patitas y proteger a tu mascota hoy mismo
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:via-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-200"
              >
                <Link to="/contact">
                  <Mail className="w-5 h-5 mr-2" />
                  Contactar para Comprar
                </Link>
              </Button>
              {user && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 hover:text-gray-100 font-medium"
                >
                  <Link to="/dashboard">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Volver al Dashboard
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Messages */}
        {!user && (
          <Card className="border-blue-700/50 bg-blue-900/20 mb-6">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 shrink-0">
                  <Info className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm md:text-base text-blue-300 leading-relaxed">
                    <span className="font-semibold text-blue-400">Nota:</span> Necesitas{" "}
                    <Link
                      to="/register"
                      className="text-blue-400 hover:text-blue-300 underline font-medium transition-colors"
                    >
                      crear una cuenta
                    </Link>{" "}
                    en E-patitas para poder registrar tus mascotas y vincularlas con la chapita.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user && (
          <Card className="border-green-700/50 bg-green-900/20">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20 shrink-0">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm md:text-base text-green-300 leading-relaxed">
                    Ya tienes una cuenta. Una vez que obtengas tu chapita, podrás activarla escaneando el código QR o acercando tu teléfono con NFC y vinculándola con tu mascota desde tu dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Chapitas;

