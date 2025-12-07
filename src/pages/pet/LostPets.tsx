import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchLostPets } from "../../features/pets/petsSlice";
import IPets from "../../types/PetsType";
import { DogIcon } from "lucide-react";

const LostPets = () => {
  const dispatch = useAppDispatch();
  const { lostPets, lostPetsLoading, lostPetsError } = useAppSelector(
    (state) => state.pets
  );
  const [imageLoadedMap, setImageLoadedMap] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    dispatch(fetchLostPets());
  }, [dispatch]);

  const handleImageLoad = (petId: string) => {
    setImageLoadedMap((prev) => ({ ...prev, [petId]: true }));
  };

  if (lostPetsLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-white">Cargando mascotas perdidas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (lostPetsError) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-6 py-4 rounded-2xl text-center">
            <h2 className="text-xl font-bold mb-2">⚠️ Error</h2>
            <p>{lostPetsError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-sm font-medium border border-red-500/20">
              Mascotas perdidas
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ayuda a reunir a estas mascotas con sus familias
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Si has visto alguna de estas mascotas, por favor contacta a sus
            dueños. Tu ayuda puede hacer la diferencia.
          </p>
        </div>

        {/* Lost Pets Grid */}
        {lostPets.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-2">
              ¡No hay mascotas perdidas reportadas!
            </h2>
            <p className="text-gray-400">
              Todas las mascotas están seguras en casa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lostPets.map((pet) => (
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
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Desconocida";

  return (
    <div className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-red-500/30 hover:border-red-500/60 transition-all duration-300 hover:transform hover:scale-105">
      {/* Pet Photo */}
      {pet.photos && pet.photos.length > 0 ? (
        <div className="h-64 bg-gray-700 relative overflow-hidden">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-6xl mb-2">🐾</div>
                <p className="text-gray-500 text-sm">Cargando foto...</p>
              </div>
            </div>
          )}

          {/* Actual image */}
          <img
            src={pet.photos[0]}
            alt={pet.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: imageLoaded ? 1 : 0 }}
            onLoad={onImageLoad}
            onError={onImageLoad}
          />

          {/* Lost Badge */}
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            PERDIDA
          </div>
        </div>
      ) : (
        <div className="h-64 bg-gray-700 flex items-center justify-center relative">
          <div className="text-8xl text-gray-500">
            {" "}
            <DogIcon className="w-10 h-10 text-gray-500" />
          </div>
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            PERDIDA
          </div>
        </div>
      )}

      {/* Pet Info */}
      <div className="p-6">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-white mb-2">{pet.name}</h2>
          <p className="text-red-400 text-sm font-semibold">
            Perdida desde: {lostDate}
          </p>
        </div>

        <div className="space-y-2 mb-4 text-gray-200">
          <p>
            <span className="font-semibold">Raza:</span> {pet.breed}
          </p>
          <p>
            <span className="font-semibold">Género:</span>{" "}
            <span className="capitalize">{pet.gender}</span>
          </p>
          {pet.description && (
            <p>
              <span className="font-semibold">Descripción:</span>{" "}
              {pet.description}
            </p>
          )}
        </div>

        {/* Additional Info */}
        {(pet.medicalInformation || pet.temperament) && (
          <div className="bg-gray-700/50 rounded-xl p-4 mb-4">
            {pet.temperament && (
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-semibold">Temperamento:</span>{" "}
                {pet.temperament}
              </p>
            )}
            {pet.medicalInformation && (
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Info Médica:</span>{" "}
                {pet.medicalInformation}
              </p>
            )}
          </div>
        )}

        {/* Contact Info */}
        <div className="bg-orange-900/20 border border-orange-700 rounded-2xl p-4">
          <h3 className="text-lg font-bold text-orange-400 mb-3">
            📞 Información de Contacto
          </h3>
          <div className="space-y-2 text-gray-200">
            {pet.owner?.name && (
              <p>
                <span className="font-semibold">Dueño:</span> {pet.owner.name}
                {pet.owner.lastname && ` ${pet.owner.lastname}`}
              </p>
            )}
            {pet.owner?.phone && (
              <p>
                <span className="font-semibold">Teléfono:</span>{" "}
                <a
                  href={`tel:${pet.owner.phone}`}
                  className="text-orange-400 hover:underline"
                >
                  {pet.owner.phone}
                </a>
              </p>
            )}
            {pet.owner?.email && (
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href={`mailto:${pet.owner.email}`}
                  className="text-orange-400 hover:underline break-all"
                >
                  {pet.owner.email}
                </a>
              </p>
            )}
          </div>
        </div>

        {pet.tagId && (
          <div className="mt-4">
            <Link
              to={`/pet/${pet.tagId}`}
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white text-center py-2 rounded-lg transition-colors"
            >
              Ver Perfil Completo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostPets;
