import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "./hooks/redux";
import { fetchLostPets } from "./features/pets/petsSlice";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Star, AlertTriangle, QrCode, Camera, Heart, Search, CheckCircle2 } from "lucide-react";

// Componente para animaciones de entrada con Intersection Observer
const AnimatedSection = ({ 
  children, 
  delay = 0,
  className = "",
  rootMargin = '0px 0px -50px 0px'
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
  rootMargin?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay, rootMargin]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Componente para animar texto palabra por palabra
const AnimatedText = ({ 
  text, 
  delay = 0,
  className = ""
}: { 
  text: string; 
  delay?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {text}
    </div>
  );
};

function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { lostPets } = useAppSelector((state) => state.pets);

  useEffect(() => {
    dispatch(fetchLostPets());
  }, [dispatch]);

  return (
    <div className="relative overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="space-y-16 md:space-y-24 pb-16">
        {/* Hero Section - Optimizado Mobile */}
        <section className="pt-8 md:pt-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <AnimatedSection delay={0}>
              <div className="inline-block mb-6 md:mb-8">
                <Badge 
                  variant="outline" 
                  className="bg-orange-500/10 text-orange-400 border-orange-500/20 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm"
                >
                  <Star className="w-3 h-3 md:w-4 md:h-4 mx-2" />
                  Sistema de Identificación Inteligente
                </Badge>
              </div>
            </AnimatedSection>

            {/* Título principal - Mobile optimized */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight px-4 mb-6 md:mb-8">
              <AnimatedText text="Tu mascota perdida," delay={100} className="block mb-2" />
              <AnimatedText 
                text="encontrada en minutos" 
                delay={300} 
                className="bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500 bg-clip-text text-transparent inline-block" 
              />
            </h1>

            {/* Subtítulo con mejor legibilidad */}
            <AnimatedSection delay={500}>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4 mb-6 md:mb-8">
                Una chapita inteligente con <span className="text-orange-400 font-semibold">tecnología QR y NFC</span> que permite 
                que quien encuentre a tu mascota te contacte{" "}
                <span className="text-white font-semibold">instantáneamente</span>. 
                Sin apps, sin esperas, sin angustia.
              </p>
            </AnimatedSection>

            {/* CTAs optimizados */}
            <AnimatedSection delay={700}>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-4 md:pt-6 px-4">
                {user ? (
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Link to="/dashboard">Ir al Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <Link to="/register">Proteger mi Mascota</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-2 border-gray-800 text-gray-300 hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/5 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <Link to="/login">Iniciar Sesión</Link>
                    </Button>
                  </>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Problema - Enfoque en dolor del cliente */}
        <section className="px-4">
          <AnimatedSection delay={300} rootMargin="0px 0px -100px 0px">
            <div className="max-w-4xl mx-auto">
            <Card className="relative bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm border-gray-800/50 overflow-hidden group hover:border-orange-500/30 transition-all duration-500 shadow-2xl hover:shadow-orange-500/20">
              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <CardContent className="relative z-10 p-6 md:p-10">
                <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-5">
                  <div className="flex-shrink-0 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-orange-400 animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <CardTitle className="text-2xl md:text-3xl text-white">
                      ¿Tu peor pesadilla?
                    </CardTitle>
                    <div className="space-y-3 text-gray-300 text-sm md:text-base leading-relaxed">
                      <p>
                        <span className="text-orange-400 font-semibold text-base md:text-lg">
                          1 de cada 3 mascotas se pierde
                        </span>{" "}
                        al menos una vez en su vida.
                      </p>
                      <p>
                        Carteles en postes. Publicaciones en Facebook. Llamadas a veterinarias. 
                        <span className="text-white font-medium"> Horas de angustia sin saber dónde está</span>.
                      </p>
                      <p className="text-orange-300 font-medium">
                        Cada minuto cuenta. E-Patitas te devuelve el control.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </AnimatedSection>
        </section>

        {/* Cómo Funciona - Cards mejoradas */}
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection delay={0}>
              <div className="text-center mb-10 md:mb-14 space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  3 pasos para la tranquilidad
                </h2>
                <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                  Tecnología simple que funciona cuando más la necesitas
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* Step 1 */}
              <AnimatedSection delay={100}>
                <Card className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-gray-800/50 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10">
                {/* Número de paso */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  1
                </div>
                
                <CardHeader>
                  <div className="bg-orange-500/10 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <QrCode className="w-7 h-7 md:w-8 md:h-8 text-orange-400 group-hover:animate-pulse" />
                  </div>
                  <CardTitle className="text-lg md:text-xl text-white">
                    Placa QR Única
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-sm md:text-base leading-relaxed">
                    Tu mascota lleva una placa resistente con su código QR exclusivo. 
                    Impermeable, duradera y diseñada para durar años.
                  </CardDescription>
                </CardContent>
                </Card>
              </AnimatedSection>

              {/* Step 2 */}
              <AnimatedSection delay={200}>
                <Card className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-gray-800/50 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  2
                </div>
                
                <CardHeader>
                  <div className="bg-orange-500/10 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Camera className="w-7 h-7 md:w-8 md:h-8 text-orange-400 group-hover:animate-pulse" />
                  </div>
                  <CardTitle className="text-lg md:text-xl text-white">
                    Escaneo Instantáneo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-sm md:text-base leading-relaxed">
                    Cualquier persona con smartphone escanea el código y accede inmediatamente 
                    a tu perfil de contacto. Sin apps, sin complicaciones.
                  </CardDescription>
                </CardContent>
                </Card>
              </AnimatedSection>

              {/* Step 3 */}
              <AnimatedSection delay={300}>
                <Card className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-gray-800/50 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  3
                </div>
                
                <CardHeader>
                  <div className="bg-orange-500/10 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Heart className="w-7 h-7 md:w-8 md:h-8 text-orange-400 group-hover:animate-pulse fill-orange-400/20" />
                  </div>
                  <CardTitle className="text-lg md:text-xl text-white">
                    Reencuentro Inmediato
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-sm md:text-base leading-relaxed">
                    Recibes una notificación con la ubicación del hallazgo. 
                    Coordinas el encuentro en minutos, no en días de búsqueda desesperada.
                  </CardDescription>
                </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Estadísticas en Vivo */}
        <section className="px-4">
          <AnimatedSection delay={0}>
            <div className="max-w-4xl mx-auto">
            <Card className="relative bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm border-gray-800/50 overflow-hidden">
              {/* Efecto de fondo animado */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,146,60,0.1),transparent_50%)] animate-pulse" />
              
              <CardContent className="relative z-10 p-6 md:p-10 space-y-6 md:space-y-8">
                <div className="text-center">
                  <CardTitle className="text-2xl md:text-3xl text-white mb-2">
                    Comunidad Activa
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm md:text-base">
                    Mascotas siendo reunidas con sus familias en tiempo real
                  </CardDescription>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  <Card className="relative group bg-gray-900/60 backdrop-blur-sm border-gray-800/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 group-hover:scale-150 transition-all duration-500" />
                    <CardContent className="relative z-10 p-5 md:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-110 inline-block">
                          {lostPets.length}
                        </span>
                        <Search className="w-6 h-6 md:w-7 md:h-7 text-orange-400/50 group-hover:text-orange-400 group-hover:scale-110 transition-all duration-300" />
                      </div>
                      <div className="text-gray-300 text-sm md:text-base font-medium mb-1">
                        Búsquedas Activas
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        Familias esperando noticias ahora
                      </div>
                      {lostPets.length > 0 && (
                        <Button
                          asChild
                          variant="ghost"
                          className="mt-4 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 p-0 h-auto"
                        >
                          <Link to="/lost-pets" className="text-xs md:text-sm font-semibold">
                            Ayudar a encontrarlas →
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="relative group bg-gray-900/60 backdrop-blur-sm border-gray-800/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 group-hover:scale-150 transition-all duration-500" />
                    <CardContent className="relative z-10 p-5 md:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-pulse group-hover:scale-150 transition-transform" />
                          <span className="text-3xl md:text-4xl font-bold text-orange-400 transition-all duration-300 group-hover:scale-110 inline-block">
                            {lostPets.length > 0 ? "ON" : "OK"}
                          </span>
                        </div>
                        <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-orange-400/50 group-hover:text-orange-400 group-hover:scale-110 transition-all duration-300" />
                      </div>
                      <div className="text-gray-300 text-sm md:text-base font-medium mb-1">
                        Sistema Operativo
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        {lostPets.length > 0
                          ? "Red de ayuda conectada 24/7"
                          : "Todas las mascotas seguras"}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {lostPets.length > 0 && (
                  <div className="text-center pt-2">
                    <Button
                      asChild
                      variant="outline"
                      className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 border-orange-500/30 text-orange-400"
                    >
                      <Link to="/lost-pets" className="inline-flex items-center gap-2">
                        <Search className="w-4 h-4 md:w-5 md:h-5" />
                        Ver todas las búsquedas activas
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          </AnimatedSection>
        </section>

        {/* Beneficio Emocional */}
        <section className="px-4">
          <AnimatedSection delay={0}>
            <div className="max-w-4xl mx-auto">
            <Card className="relative bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-orange-500/10 backdrop-blur-sm border-orange-500/20 overflow-hidden group hover:border-orange-500/40 transition-all duration-500">
              {/* Efecto de brillo */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
              
              <CardContent className="relative z-10 text-center p-6 md:p-10 space-y-4 md:space-y-5">
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-orange-500/10 rounded-2xl border border-orange-500/30 mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Heart className="w-7 h-7 md:w-8 md:h-8 text-orange-400 animate-pulse fill-orange-400/20" />
                </div>
                
                <CardTitle className="text-2xl md:text-3xl lg:text-4xl text-white">
                  No es solo tecnología
                </CardTitle>
                <CardDescription className="text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                  Es la <span className="text-orange-400 font-semibold">tranquilidad de saber</span> que 
                  si tu mejor amigo se pierde, hay un sistema probado y una comunidad entera 
                  lista para ayudarte a traerlo de vuelta a casa.
                </CardDescription>
                <p className="text-sm md:text-base text-orange-300/80 font-medium italic">
                  Porque tu mascota no es solo una mascota. Es familia.
                </p>
              </CardContent>
            </Card>
            </div>
          </AnimatedSection>
        </section>

        {/* CTA Final Mejorado */}
        <section className="px-4 pb-8">
          <AnimatedSection delay={0}>
            <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  Protege lo que más amas
                </h2>
                <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto">
                  Únete a cientos de dueños que ya duermen tranquilos
                </p>
              </div>
              
              {user ? (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-2xl hover:shadow-orange-500/30 text-lg md:text-xl px-8 md:px-10 py-4 md:py-5 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Link to="/dashboard" className="inline-flex items-center gap-3">
                    Gestionar mis Mascotas
                    <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-2xl hover:shadow-orange-500/30 text-lg md:text-xl px-8 md:px-10 py-4 md:py-5 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Link to="/register">Comenzar Ahora - Es Gratis</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-gray-800 text-gray-300 hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/5 text-lg md:text-xl px-8 md:px-10 py-4 md:py-5 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Link to="/login">Ya tengo cuenta</Link>
                  </Button>
                </div>
              )}
              
              <p className="text-xs md:text-sm text-gray-500">
                ✓ Configuración en 5 minutos &nbsp;•&nbsp; ✓ Soporte 24/7 &nbsp;•&nbsp; ✓ Actualizaciones incluidas
              </p>
            </div>
          </AnimatedSection>
        </section>
      </div>
    </div>
  );
}

export default App;