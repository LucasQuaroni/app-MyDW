import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  activateTag,
  clearTagInfo,
  fetchAvailablePets,
  fetchTagInfo,
} from "../../features/pets/petsSlice";

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
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (tagError || !tagInfo) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="bg-red-900/30 border border-red-800 text-red-300 px-6 py-4 rounded-2xl max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">⚠️ Error</h2>
          <p>{tagError || "No se pudo cargar la información"}</p>
        </div>
      </div>
    );
  }

  // CASO 1: Chapita NO activada - Usuario NO logueado
  if (!tagInfo.isActivated && tagInfo.needsLogin) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🏷️</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Chapita No Activada
          </h1>
          <p className="text-gray-300 mb-6">
            Esta chapita aún no ha sido registrada. Si acabas de comprarla,
            inicia sesión para activarla.
          </p>

          <div className="space-y-3">
            <Link
              to="/login"
              state={{ redirectTo: location.pathname }}
              className="block w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              state={{ redirectTo: location.pathname }}
              className="block w-full py-3 px-4 rounded-xl font-semibold text-gray-300 border-2 border-gray-700 hover:bg-gray-700 transition-all"
            >
              Crear Cuenta
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            ¿Encontraste una mascota con esta chapita? Por favor contacta a las
            autoridades locales.
          </p>
        </div>
      </div>
    );
  }

  // CASO 2: Chapita NO activada - Usuario SÍ logueado
  if (!tagInfo.isActivated && tagInfo.canActivate) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✨</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Activa tu Chapita
            </h1>
            <p className="text-gray-300">
              Esta chapita está lista para ser asociada a una de tus mascotas
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Código de Chapita
              </label>
              <input
                type="text"
                value={tagId}
                disabled
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selecciona tu Mascota
              </label>
              {availablePets.length > 0 ? (
                <select
                  value={selectedPet}
                  disabled={availablePetsLoading || activating}
                  onChange={(e) => setSelectedPet(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                >
                  <option value="">Selecciona una mascota</option>
                  {availablePets.map((pet) => (
                    <option key={pet._id} value={pet._id}>
                      {pet.name} - {pet.breed}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-3">
                    No tienes mascotas sin chapita registradas
                  </p>
                  <Link
                    to="/dashboard/create"
                    state={{
                      redirectTo: location.pathname,
                      fromTagActivation: true,
                    }}
                    className="inline-block py-2 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    Registrar Mascota
                  </Link>
                </div>
              )}
            </div>

            {availablePets.length > 0 && (
              <button
                onClick={() =>
                  dispatch(activateTag({ tagId: tagId!, petId: selectedPet }))
                }
                disabled={activating || !selectedPet}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {activating ? "Activando..." : "Activar Chapita"}
              </button>
            )}

            {activationError && (
              <div className="text-red-500 text-sm mt-2">{activationError}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CASO 3: Chapita ACTIVADA - Mostrar perfil público
  if (tagInfo.isActivated && tagInfo.pet) {
    const { pet, owner } = tagInfo;

    return (
      <div className="min-h-screen  py-8 px-4">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-700">
          {/* Foto de la mascota */}
          {pet.photos && pet.photos.length > 0 && (
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
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)} // Show content even if image fails
              />
            </div>
          )}

          {/* Información de la mascota */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                ¡Hola! Soy {pet.name} 🐾
              </h1>
              <p className="text-orange-500 font-medium">
                {pet.breed} • {pet.gender}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">
                  Sobre mí
                </h3>
                <p className="text-gray-200">{pet.description}</p>
              </div>

              {pet.temperament && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">
                    Temperamento
                  </h3>
                  <p className="text-gray-200">{pet.temperament}</p>
                </div>
              )}

              {pet.medicalInformation && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">
                    Información Médica
                  </h3>
                  <p className="text-gray-200">{pet.medicalInformation}</p>
                </div>
              )}
            </div>

            {/* Información de contacto */}
            <div className="bg-orange-900/20 border border-orange-700 rounded-2xl p-4">
              <h3 className="text-lg font-bold text-orange-400 mb-3">
                📞 Información de Contacto
              </h3>
              <div className="space-y-2 text-gray-200">
                {owner?.name && (
                  <p>
                    <span className="font-semibold">Dueño:</span> {owner.name}
                  </p>
                )}
                {owner?.phone && (
                  <p>
                    <span className="font-semibold">Teléfono:</span>{" "}
                    <a
                      href={`tel:${owner.phone}`}
                      className="text-orange-400 hover:underline"
                    >
                      {owner.phone}
                    </a>
                  </p>
                )}
                {owner?.email && (
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    <a
                      href={`mailto:${owner.email}`}
                      className="text-orange-400 hover:underline"
                    >
                      {owner.email}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-400">
              <p>
                Si me encontraste, por favor contacta a mi dueño. ¡Gracias! ❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PetQRPage;
