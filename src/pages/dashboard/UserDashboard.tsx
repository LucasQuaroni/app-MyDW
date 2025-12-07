import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../config/axios";
import IPets from "../../types/PetsType";

import { DogIcon } from "lucide-react";
import { useAppSelector } from "../../hooks/redux";
import { selectUser } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../hooks/redux";
import { fetchPets, deletePet, toggleLostStatus } from "../../features/pets/petsSlice";

const UserDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const { pets, loading, error } = useAppSelector((state) => state.pets);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);
  const [togglingLostId, setTogglingLostId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  const handleDelete = async (petId: string, petName: string) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar a ${petName}? Esta acción no se puede deshacer.`
      )
    ) {
      try {
        setDeletingPetId(petId);
        await dispatch(deletePet(petId)).unwrap();
      } catch (error) {
        console.error("Error al eliminar mascota:", error);
        alert("Error al eliminar la mascota. Por favor, intenta de nuevo.");
      } finally {
        setDeletingPetId(null);
      }
    }
  };

  const handleToggleLost = async (petId: string, currentStatus: boolean, petName: string) => {
    const action = currentStatus ? "desmarcar" : "marcar";
    const message = currentStatus
      ? `¿Deseas desmarcar a ${petName} como encontrada?`
      : `¿Deseas marcar a ${petName} como perdida? Esto hará que aparezca en la página pública de mascotas perdidas.`;

    if (window.confirm(message)) {
      try {
        setTogglingLostId(petId);
        await dispatch(toggleLostStatus({ id: petId, isLost: !currentStatus })).unwrap();
      } catch (error) {
        console.error("Error al actualizar estado:", error);
        alert(`Error al ${action} la mascota como perdida. Por favor, intenta de nuevo.`);
      } finally {
        setTogglingLostId(null);
      }
    }
  };

  const handleEdit = (petId: string) => {
    navigate(`/dashboard/edit/${petId}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-gray-400">
          Bienvenido,{" "}
          <span className="text-orange-500 font-semibold">{user?.email}</span>
        </p>
      </div>

      {/* Flex container to reorder on mobile */}
      <div className="flex flex-col">
        {/* Quick Actions - Horizontal scroll on mobile, grid on desktop */}
        <div className="mb-6 md:mb-8 order-2 md:order-1">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {/* Add Pet Card */}
            <div className="flex-shrink-0 w-[280px] md:w-auto bg-gray-800 rounded-2xl p-5 md:p-6 border border-gray-700 shadow-md">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-100">
                  Agregar
                </h3>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4">
                Registra una nueva mascota
              </p>
              <Link
                to="/dashboard/create"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 transition-all shadow-md hover:shadow-lg"
              >
                Nueva Mascota
              </Link>
            </div>

            {/* Stats Card */}
            <div className="flex-shrink-0 w-[280px] md:w-auto bg-gray-800 rounded-2xl p-5 md:p-6 border border-gray-700 shadow-md">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-100">
                  Estadísticas
                </h3>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">
                Total de mascotas:{" "}
                <span className="text-gray-100 font-semibold">
                  {pets.length}
                </span>
              </p>
              <p className="text-gray-400 text-xs md:text-sm">
                Registradas este mes:{" "}
                <span className="text-gray-100 font-semibold">
                  {
                    pets.filter((pet) => {
                      const petDate = new Date(pet.createdAt);
                      const now = new Date();
                      return (
                        petDate.getMonth() === now.getMonth() &&
                        petDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </span>
              </p>
            </div>

            {/* Reminders Card - Hidden on mobile */}
            <div className="hidden lg:block bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-100">
                  Recordatorios
                </h3>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                No hay recordatorios pendientes
              </p>
            </div>
          </div>
        </div>

        {/* My Pets Section - Shows first on mobile */}
        <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-gray-700 shadow-md mb-6 md:mb-8 order-1 md:order-2">
          <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-4">
            Mis Mascotas
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <p className="text-gray-400">Cargando mascotas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-gray-400 mb-4">
                Aún no has registrado ninguna mascota
              </p>
              <Link
                to="/dashboard/create"
                className="inline-flex items-center text-orange-500 hover:text-orange-400 font-semibold transition-colors"
              >
                Registrar primera mascota
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.slice(0, 6).map((pet) => (
                <div
                  key={pet._id}
                  className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/10"
                >
                  <Link to={`/pet/${pet.tagId}`}>
                    {pet.photos && pet.photos.length > 0 ? (
                      <div className="w-full h-32 bg-gray-600 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={pet.photos[0]}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gray-600 rounded-lg mb-3 flex items-center justify-center">
                        <DogIcon className="w-10 h-10 text-gray-500" />
                      </div>
                    )}
                  </Link>
                  <h3 className="text-lg font-semibold text-gray-100 mb-1">
                    {pet.name}
                    {pet.isLost && (
                      <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                        PERDIDA
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">{pet.breed}</p>
                  {pet?.gender && (
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="capitalize">{pet?.gender}</span>
                      <span>
                        {new Date(pet.birthDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 mt-3">
                    <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pet._id)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1"
                      title="Editar mascota"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(pet._id, pet.name)}
                      disabled={deletingPetId === pet._id}
                      className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Eliminar mascota"
                    >
                      {deletingPetId === pet._id ? (
                        <>Eliminando...</>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Eliminar
                          </>
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => handleToggleLost(pet._id, pet.isLost || false, pet.name)}
                      disabled={togglingLostId === pet._id}
                      className={`w-full py-2 px-3 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                        pet.isLost
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-amber-600 hover:bg-amber-700"
                      }`}
                      title={pet.isLost ? "Marcar como encontrada" : "Marcar como perdida"}
                    >
                      {togglingLostId === pet._id ? (
                        <>Actualizando...</>
                      ) : pet.isLost ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Encontrada
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
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
                          Reportar Perdida
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
