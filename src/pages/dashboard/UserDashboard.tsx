import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DogIcon,
  Plus,
  BarChart3,
  Bell,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { useAppSelector } from "../../hooks/redux";
import { selectUser } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../hooks/redux";
import {
  fetchPets,
  deletePet,
  toggleLostStatus,
} from "../../features/pets/petsSlice";
import ConfirmModal from "../../components/ConfirmModal";
import ReportLostModal from "../../components/ReportLostModal";
import RemindersModal, { Reminder } from "../../components/RemindersModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const UserDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const { pets, loading, error } = useAppSelector((state) => state.pets);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);
  const [togglingLostId, setTogglingLostId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    petId: string | null;
    petName: string;
  }>({
    isOpen: false,
    petId: null,
    petName: "",
  });
  const [toggleLostModal, setToggleLostModal] = useState<{
    isOpen: boolean;
    petId: string | null;
    petName: string;
    currentStatus: boolean;
  }>({
    isOpen: false,
    petId: null,
    petName: "",
    currentStatus: false,
  });
  const [reportLostModal, setReportLostModal] = useState<{
    isOpen: boolean;
    petId: string | null;
    petName: string;
  }>({
    isOpen: false,
    petId: null,
    petName: "",
  });
  const [remindersModalOpen, setRemindersModalOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  // TODO: Implementar sistema real de recordatorios
  // Por ahora, el array de reminders está vacío hasta que se implemente el sistema real

  const handleDeleteClick = (petId: string, petName: string) => {
    setDeleteModal({
      isOpen: true,
      petId,
      petName,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.petId) return;

    try {
      setDeletingPetId(deleteModal.petId);
      setErrorMessage(null);
      await dispatch(deletePet(deleteModal.petId)).unwrap();
      setDeleteModal({ isOpen: false, petId: null, petName: "" });
    } catch (error: any) {
      console.error("Error al eliminar mascota:", error);
      const errorMsg = error?.message || "Error al eliminar la mascota. Por favor, intenta de nuevo.";
      setErrorMessage(errorMsg);
      setDeleteModal({ isOpen: false, petId: null, petName: "" });
    } finally {
      setDeletingPetId(null);
    }
  };

  const handleToggleLostClick = (
    petId: string,
    currentStatus: boolean,
    petName: string
  ) => {
    if (currentStatus) {
      // Si ya está perdida, mostrar modal de confirmación para marcar como encontrada
      setToggleLostModal({
        isOpen: true,
        petId,
        petName,
        currentStatus,
      });
    } else {
      // Si no está perdida, mostrar modal para reportar con ubicación
      setReportLostModal({
        isOpen: true,
        petId,
        petName,
      });
    }
  };

  const handleToggleLostConfirm = async () => {
    if (!toggleLostModal.petId) return;

    const { petId, currentStatus } = toggleLostModal;
    const action = currentStatus ? "desmarcar" : "marcar";

    try {
      setTogglingLostId(petId);
      setErrorMessage(null);
      await dispatch(
        toggleLostStatus({ id: petId, isLost: !currentStatus })
      ).unwrap();
      setToggleLostModal({
        isOpen: false,
        petId: null,
        petName: "",
        currentStatus: false,
      });
    } catch (error: any) {
      console.error("Error al actualizar estado:", error);
      const errorMsg = error?.message || `Error al ${action} la mascota como perdida. Por favor, intenta de nuevo.`;
      setErrorMessage(errorMsg);
      setToggleLostModal({
        isOpen: false,
        petId: null,
        petName: "",
        currentStatus: false,
      });
    } finally {
      setTogglingLostId(null);
    }
  };

  const handleReportLostConfirm = async (location: string) => {
    if (!reportLostModal.petId) return;

    try {
      setTogglingLostId(reportLostModal.petId);
      setErrorMessage(null);
      await dispatch(
        toggleLostStatus({ 
          id: reportLostModal.petId, 
          isLost: true, 
          lostLocation: location 
        })
      ).unwrap();
      setReportLostModal({
        isOpen: false,
        petId: null,
        petName: "",
      });
    } catch (error: any) {
      console.error("Error al reportar mascota perdida:", error);
      const errorMsg = error?.message || "Error al reportar la mascota como perdida. Por favor, intenta de nuevo.";
      setErrorMessage(errorMsg);
      setReportLostModal({
        isOpen: false,
        petId: null,
        petName: "",
      });
    } finally {
      setTogglingLostId(null);
    }
  };

  const handleEdit = (petId: string) => {
    navigate(`/dashboard/edit/${petId}`);
  };

  const handleCompleteReminder = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === reminderId
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const pendingRemindersCount = reminders.filter((r) => !r.completed).length;

  const totalPets = Array.isArray(pets) ? pets.length : 0;
  const petsThisMonth = Array.isArray(pets)
    ? pets.filter((pet) => {
        const petDate = new Date(pet.createdAt);  
        const now = new Date();
        return (
          petDate.getMonth() === now.getMonth() &&
          petDate.getFullYear() === now.getFullYear()
        );
      }).length
    : 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-8">
      {/* Error Message */}
      {errorMessage && (
        <Card className="border-red-700/50 bg-red-900/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-300">
                    Error
                  </p>
                  <p className="text-xs text-red-200 mt-1">{errorMessage}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setErrorMessage(null)}
                className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header - Mobile First */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-100 mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400">
            Bienvenido,{" "}
            <span className="text-orange-500 font-medium">{user?.email}</span>
          </p>
        </div>
        {/* Reminders Button - Only visible on mobile */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setRemindersModalOpen(true)}
          className="relative h-11 w-11 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 hover:border-purple-500 shrink-0 lg:hidden"
          title="Ver recordatorios"
        >
          <Bell className="w-5 h-5" />
          {pendingRemindersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {pendingRemindersCount > 9 ? "9+" : pendingRemindersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Quick Actions - Vertical Stack on Mobile */}
      <div className="space-y-4 mb-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
        {/* Add Pet Card */}
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-100">
                Agregar Mascota
              </CardTitle>
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <CardDescription className="text-xs text-gray-400 mt-1">
              Registra una nueva mascota en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white h-11"
            >
              <Link to="/dashboard/create">
                <Plus className="w-4 h-4" />
                Nueva Mascota
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-100">
                Estadísticas
              </CardTitle>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Total mascotas</span>
              <span className="text-lg font-bold text-gray-100">{totalPets}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Este mes</span>
              <span className="text-lg font-bold text-gray-100">{petsThisMonth}</span>
            </div>
          </CardContent>
        </Card>

        {/* Reminders Card - Hidden on mobile, visible on desktop */}
        <Card 
          className="hidden lg:block border-gray-700 bg-gray-800/50 cursor-pointer hover:border-purple-500/50 transition-colors"
          onClick={() => setRemindersModalOpen(true)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-100">
                Recordatorios
              </CardTitle>
              <div className="relative">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-500" />
                </div>
                {pendingRemindersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {pendingRemindersCount > 9 ? "9+" : pendingRemindersCount}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {pendingRemindersCount > 0 ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-100">
                  {pendingRemindersCount} pendiente{pendingRemindersCount !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-400">Haz clic para ver detalles</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No hay recordatorios pendientes</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Pets Section */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-100">
            Mis Mascotas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-gray-500 animate-spin mb-4" />
              <p className="text-sm text-gray-400">Cargando mascotas...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : !Array.isArray(pets) || pets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <DogIcon className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-sm text-gray-400 mb-4 text-center">
                Aún no has registrado ninguna mascota
              </p>
              <Button asChild variant="outline" className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10">
                <Link to="/dashboard/create">
                  <Plus className="w-4 h-4" />
                  Registrar primera mascota
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.slice(0, 6).map((pet) => (
                <Card
                  key={pet._id}
                  className="border-gray-700/50 bg-gray-800/80 backdrop-blur-sm hover:border-orange-500/70 transition-all duration-200 overflow-hidden shadow-lg hover:shadow-xl hover:shadow-orange-500/10"
                >
                  <Link to={pet.tagId ? `/pet/${pet.tagId}` : `/pet/chapitas`}>
                    {pet.photos && pet.photos.length > 0 ? (
                      <div className="w-full aspect-video bg-gray-600 overflow-hidden">
                        <img
                          src={pet.photos[0]}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-gray-600 flex items-center justify-center">
                        <DogIcon className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                  </Link>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold text-gray-100 line-clamp-1">
                        {pet.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-1.5 shrink-0">
                        {pet.isLost && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            PERDIDA
                          </span>
                        )}
                        {!pet.tagId && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            SIN CHAPITA
                          </span>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-sm text-gray-400">
                      {pet.breed}
                    </CardDescription>
                    {pet?.gender && (
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span className="capitalize">{pet.gender}</span>
                        <span>{new Date(pet.birthDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {!pet.tagId && (
                      <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 border border-amber-600/50 rounded-lg md:rounded-xl p-2.5 md:p-3">
                        <p className="text-xs md:text-sm text-amber-300 text-center font-medium">
                          🏷️ Haz clic en la imagen para vincular una chapita
                        </p>
                      </div>
                    )}

                    {/* Action Buttons - Improved Visibility */}
                    <div className="space-y-2.5 md:space-y-3 pt-2 border-t border-gray-700/50">
                      {/* Edit and Delete Buttons */}
                      <div className="grid grid-cols-2 gap-2 md:gap-2.5">
                        <Button
                          onClick={() => handleEdit(pet._id)}
                          className="h-10 md:h-11 bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600 hover:border-gray-500 text-xs md:text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Edit className="w-4 h-4 md:w-5 md:h-5 mr-1.5" />
                          <span>Editar</span>
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(pet._id, pet.name)}
                          disabled={deletingPetId === pet._id}
                          className="h-10 md:h-11 bg-red-600 hover:bg-red-700 text-white border-0 text-xs md:text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {deletingPetId === pet._id ? (
                            <>
                              <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-1.5 animate-spin" />
                              <span>Eliminando</span>
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 md:w-5 md:h-5 mr-1.5" />
                              <span>Eliminar</span>
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Report Lost/Found Button */}
                      <Button
                        onClick={() =>
                          handleToggleLostClick(pet._id, pet.isLost || false, pet.name)
                        }
                        disabled={togglingLostId === pet._id}
                        className={`w-full h-11 md:h-12 text-sm md:text-base font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                          pet.isLost
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-green-500/25"
                            : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-lg hover:shadow-orange-500/25"
                        }`}
                      >
                        {togglingLostId === pet._id ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            <span>Actualizando...</span>
                          </>
                        ) : pet.isLost ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            <span>Marcar como Encontrada</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            <span>Reportar como Perdida</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, petId: null, petName: "" })
        }
        onConfirm={handleDeleteConfirm}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar a ${deleteModal.petName}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonColor="red"
      />

      <ConfirmModal
        isOpen={toggleLostModal.isOpen}
        onClose={() =>
          setToggleLostModal({
            isOpen: false,
            petId: null,
            petName: "",
            currentStatus: false,
          })
        }
        onConfirm={handleToggleLostConfirm}
        title={
          toggleLostModal.currentStatus
            ? "Marcar como Encontrada"
            : "Marcar como Perdida"
        }
        message={
          toggleLostModal.currentStatus
            ? `¿Deseas marcar como encontrada a ${toggleLostModal.petName}?`
            : `¿Deseas marcar como perdida a ${toggleLostModal.petName}? Esto hará que aparezca en la página pública de mascotas perdidas.`
        }
        confirmText={toggleLostModal.currentStatus ? "Marcar Encontrada" : "Marcar Perdida"}
        cancelText="Cancelar"
        confirmButtonColor={toggleLostModal.currentStatus ? "green" : "orange"}
      />

      <RemindersModal
        isOpen={remindersModalOpen}
        onClose={() => setRemindersModalOpen(false)}
        reminders={reminders}
        onCompleteReminder={handleCompleteReminder}
      />

      <ReportLostModal
        isOpen={reportLostModal.isOpen}
        onClose={() =>
          setReportLostModal({
            isOpen: false,
            petId: null,
            petName: "",
          })
        }
        onConfirm={handleReportLostConfirm}
        petName={reportLostModal.petName}
      />
    </div>
  );
};

export default UserDashboard;
