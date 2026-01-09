import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchLostPets } from "../../features/pets/petsSlice";
import { selectUser } from "../../features/auth/authSlice";
import IPets from "../../types/PetsType";
import {
  DogIcon,
  Heart,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  PawPrint,
  Filter,
  X,
  ChevronDown,
  Plus,
} from "lucide-react";

const LostPets = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { lostPets, lostPetsLoading, lostPetsError } = useAppSelector(
    (state) => state.pets
  );
  const [imageLoadedMap, setImageLoadedMap] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLostPets());
  }, [dispatch]);

  const handleImageLoad = (petId: string) => {
    setImageLoadedMap((prev) => ({ ...prev, [petId]: true }));
  };

  // Obtener lista única de ubicaciones de las mascotas perdidas
  const availableLocations = useMemo(() => {
    const locations = lostPets
      .map((pet) => pet.lostLocation)
      .filter((location): location is string => !!location);
    return [...new Set(locations)].sort();
  }, [lostPets]);

  // Filtrar mascotas por ubicación seleccionada
  const filteredPets = useMemo(() => {
    if (!selectedLocation) return lostPets;
    return lostPets.filter((pet) => pet.lostLocation === selectedLocation);
  }, [lostPets, selectedLocation]);

  if (lostPetsLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16 md:py-24">
            <div className="relative inline-block mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500/20 border-t-orange-500 mx-auto"></div>
              <Heart className="absolute inset-0 m-auto w-6 h-6 text-orange-500 animate-pulse" />
            </div>
            <p className="text-white text-lg md:text-xl font-medium">
              Buscando mascotas perdidas...
            </p>
            <p className="text-gray-400 text-sm md:text-base mt-2">
              Estamos revisando todos los reportes
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (lostPetsError) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-900/30 border border-red-800/50 text-red-300 px-6 py-6 md:py-8 rounded-2xl text-center backdrop-blur-sm">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Error al cargar
            </h2>
            <p className="text-red-200">{lostPetsError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 md:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Compact & Actionable */}
        <div className="mb-6 md:mb-10">
          {/* Top bar with live counter and CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {/* Live counter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-red-400 text-sm font-semibold">
                  {lostPets.length} {lostPets.length === 1 ? "mascota perdida" : "mascotas perdidas"}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
              >
                <Plus className="w-4 h-4" />
                <span>Reportar mascota perdida</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
              >
                <Plus className="w-4 h-4" />
                <span>¿Perdiste tu mascota? Publicá acá</span>
              </Link>
            )}
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              Mascotas perdidas en{" "}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Argentina
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Si reconocés alguna, contactá al dueño para ayudarla a volver a casa
            </p>
          </div>

          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            {/* Location Filter */}
            {availableLocations.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedLocation
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/50"
                      : "bg-gray-800/80 text-gray-300 border border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>{selectedLocation || "Filtrar por ubicación"}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {isFilterOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsFilterOpen(false)}
                    />
                    <div className="absolute left-0 sm:left-auto z-20 mt-2 w-full sm:w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                      {selectedLocation && (
                        <button
                          onClick={() => {
                            setSelectedLocation("");
                            setIsFilterOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-gray-700/50 border-b border-gray-700"
                        >
                          <X className="w-4 h-4" />
                          <span>Limpiar filtro</span>
                        </button>
                      )}
                      <div className="max-h-64 overflow-y-auto">
                        {availableLocations.map((location) => (
                          <button
                            key={location}
                            onClick={() => {
                              setSelectedLocation(location);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                              selectedLocation === location
                                ? "bg-orange-500/20 text-orange-400"
                                : "text-gray-300 hover:bg-gray-700/50"
                            }`}
                          >
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate text-left flex-1">{location}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Active filter chip */}
            {selectedLocation && (
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/30 rounded-xl text-sm">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300 truncate">{selectedLocation}</span>
                <span className="text-gray-500">({filteredPets.length})</span>
                <button
                  onClick={() => setSelectedLocation("")}
                  className="ml-1 text-orange-400 hover:text-orange-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lost Pets Grid */}
        {filteredPets.length === 0 ? (
          <div className="text-center py-16 md:py-24 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl px-4">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <Heart className="w-16 h-16 md:w-20 md:h-20 mx-auto text-orange-400 fill-orange-400/20" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {selectedLocation ? "Sin resultados" : "¡Excelentes noticias!"}
              </h2>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                {selectedLocation 
                  ? `No hay mascotas perdidas reportadas en ${selectedLocation}.`
                  : "No hay mascotas perdidas reportadas en este momento. Todas las mascotas están seguras en casa con sus familias."
                }
              </p>
              {selectedLocation && (
                <button
                  onClick={() => setSelectedLocation("")}
                  className="mt-4 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-500/30 transition-colors"
                >
                  Ver todas las mascotas
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {filteredPets.map((pet) => (
              <PetCard
                key={pet._id}
                pet={pet}
                imageLoaded={imageLoadedMap[pet._id] || false}
                onImageLoad={() => handleImageLoad(pet._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface PetCardProps {
  pet: IPets & { owner?: any };
  imageLoaded: boolean;
  onImageLoad: () => void;
}

const PetCard = ({ pet, imageLoaded, onImageLoad }: PetCardProps) => {
  const lostDate = pet.lostAt
    ? new Date(pet.lostAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      })
    : null;

  // Calculate days lost
  const daysLost = pet.lostAt
    ? Math.floor(
        (new Date().getTime() - new Date(pet.lostAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const getDaysLostText = () => {
    if (daysLost === null) return null;
    if (daysLost === 0) return "Perdida hoy";
    if (daysLost === 1) return "Perdida hace 1 día";
    return `Perdida hace ${daysLost} días`;
  };

  return (
    <article className="group relative bg-gradient-to-b from-gray-800/90 to-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-700/40 hover:border-red-500/60 transition-all duration-500 hover:shadow-red-500/15 hover:-translate-y-1">
      {/* Urgency Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Pet Photo Section */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
        {pet.photos && pet.photos.length > 0 ? (
          <>
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center z-10">
                <div className="text-center space-y-2">
                  <PawPrint className="w-10 h-10 text-gray-500 mx-auto animate-bounce" />
                  <p className="text-gray-500 text-xs">Cargando...</p>
                </div>
              </div>
            )}

            {/* Actual image */}
            <img
              src={pet.photos[0]}
              alt={`Foto de ${pet.name}`}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              style={{ opacity: imageLoaded ? 1 : 0 }}
              onLoad={onImageLoad}
              onError={onImageLoad}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
            <DogIcon className="w-16 h-16 text-gray-500/60" />
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 via-transparent to-gray-900/30" />

        {/* Lost Badge - Animated */}
        <div className="absolute top-3 right-3 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-lg blur-md opacity-60 animate-pulse" />
            <div className="relative bg-red-500/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl flex items-center gap-1.5 uppercase tracking-wide">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Perdida</span>
            </div>
          </div>
        </div>

        {/* Days Counter Badge */}
        {daysLost !== null && daysLost >= 0 && (
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-gray-900/80 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg text-xs font-medium shadow-lg flex items-center gap-1.5 border border-gray-600/50">
              <Clock className="w-3 h-3 text-orange-400" />
              <span>
                {daysLost === 0 ? "Hoy" : daysLost === 1 ? "1 día" : `${daysLost} días`}
              </span>
            </div>
          </div>
        )}

        {/* Pet Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            {pet.name}
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-gray-300 text-sm">{pet.breed}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span className="text-gray-300 text-sm capitalize">{pet.gender}</span>
          </div>
        </div>
      </div>

      {/* Pet Info Section */}
      <div className="relative p-4 space-y-3">
        {/* Lost Location */}
        {pet.lostLocation && (
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <span className="text-orange-300 text-sm font-medium truncate">
              Perdida en: {pet.lostLocation}
            </span>
          </div>
        )}

        {/* Lost Date */}
        {getDaysLostText() && (
          <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            <span>{getDaysLostText()}</span>
            {lostDate && <span className="text-gray-500">({lostDate})</span>}
          </div>
        )}

        {/* Description */}
        {pet.description && (
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">
            {pet.description}
          </p>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

        {/* Contact Section - Compact */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
            Contactar al dueño
          </p>
          
          <div className="flex flex-wrap gap-2">
            {pet.owner?.phone && (
              <a
                href={`tel:${pet.owner.phone}`}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-emerald-600/90 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar</span>
              </a>
            )}
            
            {pet.owner?.email && (
              <a
                href={`mailto:${pet.owner.email}?subject=Información sobre ${pet.name}`}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-gray-700/80 hover:bg-gray-600 text-white py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 border border-gray-600/50 hover:border-gray-500 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
            )}
          </div>
          
          {pet.owner?.address && (
            <div className="flex items-start gap-2 text-xs text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{pet.owner.address}</span>
            </div>
          )}
        </div>

        {/* View Profile Button */}
        {pet.tagId && (
          <Link
            to={`/pet/${pet.tagId}`}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] group/btn"
          >
            <span>Ver perfil completo</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        )}
      </div>
    </article>
  );
};

export default LostPets;
