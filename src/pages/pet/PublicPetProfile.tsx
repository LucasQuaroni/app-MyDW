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
  PawPrint,
  ChevronLeft,
  ChevronRight,
  Shield,
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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (tagId) {
      dispatch(fetchTagInfo(tagId));
      setImageLoaded(false);
      setCurrentPhotoIndex(0);
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

  const handleNextPhoto = () => {
    if (tagInfo?.pet?.photos && tagInfo.pet.photos.length > 1) {
      setImageLoaded(false);
      setCurrentPhotoIndex((prev) => 
        prev === tagInfo.pet!.photos!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevPhoto = () => {
    if (tagInfo?.pet?.photos && tagInfo.pet.photos.length > 1) {
      setImageLoaded(false);
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? tagInfo.pet!.photos!.length - 1 : prev - 1
      );
    }
  };

  // Loading state
  if (tagLoading) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          {/* Animated loading container */}
          <div className="relative inline-block mb-8">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 blur-xl opacity-30 animate-pulse scale-150" />
            
            {/* Spinning border */}
            <div className="relative w-24 h-24 md:w-28 md:h-28">
              <div className="absolute inset-0 rounded-full border-4 border-orange-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <PawPrint className="w-6 h-6 md:w-7 md:h-7 text-white animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Buscando información...
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xs mx-auto">
            Estamos verificando el estado de la chapita
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (tagError || !tagInfo) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <Card className="border-red-800/50 bg-gradient-to-br from-red-950/40 to-gray-900/80 max-w-md w-full backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Animated error icon */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">
              Error al cargar
            </h2>
            <p className="text-red-200/80 leading-relaxed mb-6">
              {tagError || "No se pudo cargar la información de la chapita"}
            </p>
            
            <Button
              asChild
              variant="outline"
              className="border-red-700/50 text-red-300 hover:bg-red-900/30 hover:border-red-600"
            >
              <Link to="/">
                Volver al inicio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CASO 1: Chapita NO activada - Usuario NO logueado
  if (!tagInfo.isActivated && tagInfo.needsLogin) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        
        <Card className="relative border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl max-w-md w-full shadow-2xl overflow-hidden">
          {/* Top decorative gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />
          
          <CardContent className="p-8">
            <div className="text-center mb-8">
              {/* Animated tag icon */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse scale-125" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border-2 border-orange-500/30 shadow-xl">
                  <Tag className="w-12 h-12 text-orange-400" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Chapita No Activada
              </h1>
              <p className="text-gray-300 leading-relaxed">
                Esta chapita aún no ha sido registrada. Si acabas de comprarla,
                inicia sesión para activarla y vincularla con tu mascota.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <Button
                asChild
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link to="/login" state={{ redirectTo: location.pathname }}>
                  <User className="w-5 h-5 mr-2" />
                  Iniciar Sesión
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full h-14 border-2 border-gray-600 text-gray-200 hover:bg-gray-700/50 hover:border-orange-500/50 hover:text-orange-300 font-semibold text-lg transition-all duration-300"
              >
                <Link to="/register" state={{ redirectTo: location.pathname }}>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Crear Cuenta
                </Link>
              </Button>
            </div>

            {/* Info card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-900/30 to-blue-950/50 border border-blue-700/30 p-4">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
              <div className="relative flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-sm text-blue-200/90 leading-relaxed">
                  ¿Encontraste una mascota con esta chapita? Por favor contacta a las
                  autoridades locales o a E-patitas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CASO 2: Chapita NO activada - Usuario SÍ logueado
  if (!tagInfo.isActivated && tagInfo.canActivate) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -left-32 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        
        <Card className="relative border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl max-w-md w-full shadow-2xl overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 animate-pulse" />
          
          <CardContent className="p-8">
            <div className="text-center mb-8">
              {/* Sparkle animation */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl animate-pulse scale-125" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/40">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                {/* Floating particles */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-3">
                ¡Activa tu Chapita!
              </h1>
              <p className="text-gray-300 leading-relaxed">
                Esta chapita está lista para ser asociada a una de tus mascotas
              </p>
            </div>

            <div className="space-y-5">
              {/* Tag code display */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Tag className="w-4 h-4 text-orange-400" />
                  Código de Chapita
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tagId}
                    disabled
                    className="w-full px-4 py-3.5 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-gray-400 cursor-not-allowed font-mono text-center tracking-wider"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <Shield className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Pet selector */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <PawPrint className="w-4 h-4 text-orange-400" />
                  Selecciona tu Mascota
                </label>
                
                {availablePets.length > 0 ? (
                  <>
                    <div className="relative">
                      <select
                        value={selectedPet}
                        disabled={availablePetsLoading || activating}
                        onChange={(e) => setSelectedPet(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-900/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-white transition-all duration-200 appearance-none cursor-pointer hover:border-gray-600"
                      >
                        <option value="">Elige una mascota...</option>
                        {availablePets.map((pet) => (
                          <option key={pet._id} value={pet._id}>
                            {pet.name} - {pet.breed}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <ChevronRight className="w-5 h-5 text-gray-500 rotate-90" />
                      </div>
                    </div>
                    
                    {activationError && (
                      <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-red-300">{activationError}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-dashed border-gray-700 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5" />
                    <div className="relative text-center">
                      <div className="w-14 h-14 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DogIcon className="w-7 h-7 text-gray-500" />
                      </div>
                      <p className="text-gray-400 mb-4">
                        No tienes mascotas sin chapita registradas
                      </p>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/25"
                      >
                        <Link
                          to="/dashboard/create"
                          state={{
                            redirectTo: location.pathname,
                            fromTagActivation: true,
                          }}
                        >
                          <PawPrint className="w-4 h-4 mr-2" />
                          Registrar Mascota
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Activate button */}
              {availablePets.length > 0 && (
                <Button
                  onClick={() =>
                    dispatch(activateTag({ tagId: tagId!, petId: selectedPet }))
                  }
                  disabled={activating || !selectedPet}
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
    const hasMultiplePhotos = pet.photos && pet.photos.length > 1;

    return (
      <div className="min-h-screen py-6 md:py-12 px-4">
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-3xl mx-auto">
          {/* Main card */}
          <Card className="border-0 bg-transparent overflow-visible shadow-none">
            {/* Photo section with overlay card effect */}
            <div className="relative">
              {/* Photo container */}
              <div className="relative h-72 md:h-96 rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl">
                {pet.photos && pet.photos.length > 0 ? (
                  <>
                    {/* Loading skeleton */}
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="relative inline-block">
                            <div className="w-16 h-16 rounded-full border-4 border-gray-600 border-t-orange-500 animate-spin" />
                            <Heart className="absolute inset-0 m-auto w-6 h-6 text-orange-400" />
                          </div>
                          <p className="text-gray-500 text-sm mt-4">Cargando foto...</p>
                        </div>
                      </div>
                    )}

                    {/* Photo */}
                    <img
                      src={pet.photos[currentPhotoIndex]}
                      alt={`Foto de ${pet.name}`}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                      style={{ opacity: imageLoaded ? 1 : 0 }}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)}
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                    
                    {/* Photo navigation */}
                    {hasMultiplePhotos && (
                      <>
                        <button
                          onClick={handlePrevPhoto}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all z-20"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={handleNextPhoto}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all z-20"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        
                        {/* Photo indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                          {pet.photos.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setImageLoaded(false);
                                setCurrentPhotoIndex(idx);
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentPhotoIndex
                                  ? "bg-orange-500 w-6"
                                  : "bg-white/50 hover:bg-white/80"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-600/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DogIcon className="w-12 h-12 text-gray-500" />
                      </div>
                      <p className="text-gray-500">Sin foto</p>
                    </div>
                  </div>
                )}
                
                {/* Pet name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <div className="flex items-end justify-between">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-1">
                        {pet.name}
                      </h1>
                      <div className="flex items-center gap-2 text-orange-300/90">
                        <span className="font-medium">{pet.breed}</span>
                        <span className="w-1 h-1 rounded-full bg-orange-400/60" />
                        <span className="capitalize">{pet.gender}</span>
                      </div>
                    </div>
                    
                    {/* Verified badge */}
                    <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/40 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-xs font-medium">Verificado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content card - overlapping the photo */}
            <div className="relative -mt-4 md:-mt-6 mx-2 md:mx-4">
              <Card className="border-gray-700/50 bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  {/* Pet info sections */}
                  <div className="space-y-6">
                    {/* About section */}
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                          <Heart className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Sobre mí</h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed pl-[52px]">
                        {pet.description}
                      </p>
                    </div>

                    {/* Temperament */}
                    {pet.temperament && (
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                          </div>
                          <h3 className="text-lg font-bold text-white">Temperamento</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed pl-[52px]">
                          {pet.temperament}
                        </p>
                      </div>
                    )}

                    {/* Medical info */}
                    {pet.medicalInformation && (
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                          </div>
                          <h3 className="text-lg font-bold text-white">Información Médica</h3>
                        </div>
                        <div className="pl-[52px]">
                          <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4">
                            <p className="text-red-200/90 leading-relaxed">
                              {pet.medicalInformation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                  {/* Contact section */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/30 via-amber-900/20 to-orange-900/30 border border-orange-700/30">
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
                    
                    <div className="relative p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            Información de Contacto
                          </h3>
                          <p className="text-orange-300/80 text-sm">
                            ¿Me encontraste? Contacta a mi dueño
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid gap-4">
                        {owner?.name && (
                          <div className="flex items-center gap-4 bg-gray-800/40 rounded-xl p-4 border border-gray-700/50 hover:border-orange-500/30 transition-colors">
                            <div className="w-11 h-11 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Dueño
                              </p>
                              <p className="text-white font-medium truncate">
                                {owner.name} {owner.lastname && owner.lastname}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {owner?.phone && (
                          <a
                            href={`tel:${owner.phone}`}
                            className="flex items-center gap-4 bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/40 hover:border-emerald-500/60 hover:bg-emerald-900/40 transition-all group"
                          >
                            <div className="w-11 h-11 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors">
                              <Phone className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-emerald-400/80 uppercase tracking-wider mb-1">
                                Teléfono
                              </p>
                              <p className="text-emerald-300 font-semibold group-hover:text-emerald-200 transition-colors">
                                {owner.phone}
                              </p>
                            </div>
                            <div className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                          </a>
                        )}
                        
                        {owner?.email && (
                          <a
                            href={`mailto:${owner.email}?subject=Información sobre ${pet.name}`}
                            className="flex items-center gap-4 bg-gray-800/40 rounded-xl p-4 border border-gray-700/50 hover:border-orange-500/40 hover:bg-gray-800/60 transition-all group"
                          >
                            <div className="w-11 h-11 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                              <Mail className="w-5 h-5 text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Email
                              </p>
                              <p className="text-orange-300 font-medium truncate group-hover:text-orange-200 transition-colors">
                                {owner.email}
                              </p>
                            </div>
                            <div className="text-gray-600 group-hover:text-orange-500 transition-colors">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                          </a>
                        )}
                        
                        {owner?.address && (
                          <div className="flex items-center gap-4 bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                            <div className="w-11 h-11 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-5 h-5 text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Dirección
                              </p>
                              <p className="text-gray-300 leading-relaxed">
                                {owner.address}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer message */}
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 rounded-2xl border border-orange-500/20">
                      <Heart className="w-6 h-6 text-orange-400 fill-orange-400/30 animate-pulse" />
                      <div className="text-left">
                        <p className="text-white font-medium">
                          ¡Gracias por ayudarme!
                        </p>
                        <p className="text-gray-400 text-sm">
                          Tu ayuda me acerca a casa
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Powered by footer */}
            <div className="text-center mt-6 md:mt-8">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-400 transition-colors text-sm"
              >
                <PawPrint className="w-4 h-4" />
                <span>Powered by E-patitas</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default PetQRPage;
