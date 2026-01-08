import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  activateTag,
  clearTagInfo,
  fetchAvailablePets,
  fetchTagInfo,
} from "../../features/pets/petsSlice";
import {
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  User,
  Heart,
  DogIcon,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const PetQRPage = () => {
  const { id: tagId } = useParams<{ id: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const {
    tagInfo,
    tagLoading,
    tagError,
    availablePets,
    availablePetsLoading,
    activating,
    activationError,
  } = useAppSelector((state) => state.pets);
  const [selectedPet, setSelectedPet] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (tagId) {
      dispatch(fetchTagInfo(tagId));
      setImageLoaded(false);
    }

    return () => {
      dispatch(clearTagInfo());
    };
  }, [tagId, dispatch]);

  useEffect(() => {
    if (tagInfo?.canActivate && user) {
      dispatch(fetchAvailablePets());
    }
  }, [tagInfo?.canActivate, user, dispatch]);

  if (tagLoading) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500/20 border-t-orange-500 mx-auto"></div>
            <Tag className="absolute inset-0 m-auto w-8 h-8 text-orange-500 animate-pulse" />
          </div>
          <p className="text-white text-lg md:text-xl font-medium">
            Cargando información de la chapita...
          </p>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Estamos verificando el estado de la chapita
          </p>
        </div>
      </div>
    );
  }

  if (tagError || !tagInfo) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <Card className="border-red-700/50 bg-red-900/20 max-w-md w-full">
          <CardContent className="p-6 md:p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-red-300 mb-3">
              Error al cargar
            </h2>
            <p className="text-sm md:text-base text-red-200">
              {tagError || "No se pudo cargar la información de la chapita"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CASO 1: Chapita NO activada - Usuario NO logueado
  if (!tagInfo.isActivated && tagInfo.needsLogin) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <Card className="border-gray-700/50 bg-gray-800/80 backdrop-blur-sm max-w-md w-full">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Tag className="w-10 h-10 md:w-12 md:h-12 text-orange-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
                Chapita No Activada
              </h1>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                Esta chapita aún no ha sido registrada. Si acabas de comprarla,
                inicia sesión para activarla y vincularla con tu mascota.
              </p>
            </div>

            <div className="space-y-3 md:space-y-4 mb-6">
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:via-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-200"
              >
                <Link to="/login" state={{ redirectTo: location.pathname }}>
                  Iniciar Sesión
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 hover:text-gray-100 font-medium"
              >
                <Link to="/register" state={{ redirectTo: location.pathname }}>
                  Crear Cuenta
                </Link>
              </Button>
            </div>

            <Card className="border-blue-700/50 bg-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm text-blue-300 leading-relaxed">
                    ¿Encontraste una mascota con esta chapita? Por favor contacta a las
                    autoridades locales o a E-patitas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CASO 2: Chapita NO activada - Usuario SÍ logueado
  if (!tagInfo.isActivated && tagInfo.canActivate) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <Card className="border-gray-700/50 bg-gray-800/80 backdrop-blur-sm max-w-md w-full">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-orange-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">
                Activa tu Chapita
              </h1>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                Esta chapita está lista para ser asociada a una de tus mascotas
              </p>
            </div>

            <div className="space-y-4 md:space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Código de Chapita
                </label>
                <input
                  type="text"
                  value={tagId}
                  disabled
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Selecciona tu Mascota
                </label>
                {availablePets.length > 0 ? (
                  <>
                    <select
                      value={selectedPet}
                      disabled={availablePetsLoading || activating}
                      onChange={(e) => setSelectedPet(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white text-base transition-all"
                    >
                      <option value="">Selecciona una mascota</option>
                      {availablePets.map((pet) => (
                        <option key={pet._id} value={pet._id}>
                          {pet.name} - {pet.breed}
                        </option>
                      ))}
                    </select>
                    {activationError && (
                      <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-red-300">{activationError}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Card className="border-gray-700/50 bg-gray-900/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-400 mb-4">
                        No tienes mascotas sin chapita registradas
                      </p>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                      >
                        <Link
                          to="/dashboard/create"
                          state={{
                            redirectTo: location.pathname,
                            fromTagActivation: true,
                          }}
                        >
                          Registrar Mascota
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {availablePets.length > 0 && (
                <Button
                  onClick={() =>
                    dispatch(activateTag({ tagId: tagId!, petId: selectedPet }))
                  }
                  disabled={activating || !selectedPet}
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:via-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Activando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Activar Chapita
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CASO 3: Chapita ACTIVADA - Mostrar perfil público
  if (tagInfo.isActivated && tagInfo.pet) {
    const { pet, owner } = tagInfo;

    return (
      <div className="min-h-screen py-6 md:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-gray-700/50 bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow-xl">
            {/* Foto de la mascota */}
            {pet.photos && pet.photos.length > 0 ? (
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                {/* Loading skeleton */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center z-10">
                    <div className="text-center">
                      <Heart className="w-12 h-12 md:w-16 md:h-16 text-gray-500 mx-auto mb-2 animate-pulse" />
                      <p className="text-gray-500 text-xs md:text-sm">
                        Cargando foto...
                      </p>
                    </div>
                  </div>
                )}

                {/* Actual image */}
                <img
                  src={pet.photos[0]}
                  alt={pet.name}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  style={{ opacity: imageLoaded ? 1 : 0 }}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="h-64 md:h-80 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <DogIcon className="w-20 h-20 md:w-24 md:h-24 text-gray-500" />
              </div>
            )}

            <CardContent className="p-6 md:p-8">
              {/* Header con nombre */}
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3">
                  ¡Hola! Soy {pet.name}
                </h1>
                <div className="flex items-center justify-center gap-2 text-sm md:text-base text-orange-400 font-medium">
                  <span>{pet.breed}</span>
                  <span>•</span>
                  <span className="capitalize">{pet.gender}</span>
                </div>
              </div>

              {/* Información de la mascota */}
              <div className="space-y-5 md:space-y-6 mb-6 md:mb-8">
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-400 mb-2 md:mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-orange-400" />
                    Sobre mí
                  </h3>
                  <p className="text-sm md:text-base text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                    {pet.description}
                  </p>
                </div>

                {pet.temperament && (
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-400 mb-2 md:mb-3 flex items-center gap-2">
                      <span className="text-orange-400">✨</span>
                      Temperamento
                    </h3>
                    <p className="text-sm md:text-base text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                      {pet.temperament}
                    </p>
                  </div>
                )}

                {pet.medicalInformation && (
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-400 mb-2 md:mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      Información Médica
                    </h3>
                    <p className="text-sm md:text-base text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                      {pet.medicalInformation}
                    </p>
                  </div>
                )}
              </div>

              {/* Información de contacto */}
              <Card className="border-orange-700/50 bg-gradient-to-br from-orange-900/20 to-amber-900/20 mb-6">
                <CardContent className="p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-orange-400 mb-4 md:mb-5 flex items-center gap-2">
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                    Información de Contacto
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {owner?.name && (
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs md:text-sm font-semibold text-gray-400 mb-1">
                            Dueño
                          </p>
                          <p className="text-sm md:text-base text-gray-200">
                            {owner.name}
                          </p>
                        </div>
                      </div>
                    )}
                    {owner?.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs md:text-sm font-semibold text-gray-400 mb-1">
                            Email
                          </p>
                          <a
                            href={`mailto:${owner.email}`}
                            className="text-sm md:text-base text-orange-400 hover:text-orange-300 transition-colors break-all"
                          >
                            {owner.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {owner?.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs md:text-sm font-semibold text-gray-400 mb-1">
                            Teléfono
                          </p>
                          <a
                            href={`tel:${owner.phone}`}
                            className="text-sm md:text-base text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            {owner.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    {owner?.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs md:text-sm font-semibold text-gray-400 mb-1">
                            Dirección
                          </p>
                          <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                            {owner.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Mensaje final */}
              <div className="text-center">
                <Card className="border-gray-700/50 bg-gray-900/30">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-orange-400 fill-orange-400/20" />
                      <p className="text-sm md:text-base text-gray-300 font-medium">
                        Si me encontraste, por favor contacta a mi dueño
                      </p>
                    </div>
                    <p className="text-xs md:text-sm text-gray-400">
                      ¡Gracias por ayudarme a volver a casa!
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default PetQRPage;
