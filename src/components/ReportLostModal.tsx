import { Fragment, useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  MapPin,
  AlertTriangle,
  Search,
  X,
  Loader2,
  Check,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useGeorefArgentina } from "../hooks/useGeorefArgentina";

interface ReportLostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: string) => void;
  petName: string;
}

type Step = "provincia" | "localidad" | "confirm";

const ReportLostModal = ({
  isOpen,
  onClose,
  onConfirm,
  petName,
}: ReportLostModalProps) => {
  const {
    provincias,
    provinciasLoading,
    provinciasError,
    selectedProvincia,
    handleProvinciaChange,
    localidades,
    localidadesLoading,
    localidadesError,
    selectedLocalidad,
    handleLocalidadChange,
    reset,
    getFormattedLocation,
    isComplete,
  } = useGeorefArgentina();

  const [step, setStep] = useState<Step>("provincia");
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Función para cerrar el modal
  const handleClose = useCallback(() => {
    reset();
    setSearchTerm("");
    setStep("provincia");
    onClose();
  }, [reset, onClose]);

  // Focus en el input cuando cambia el step (solo en desktop)
  useEffect(() => {
    if (isOpen && window.innerWidth >= 768) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, step]);

  // Manejar tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Resetear cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSearchTerm("");
      setStep("provincia");
    }
  }, [isOpen, reset]);

  // Limpiar búsqueda cuando cambia el step
  useEffect(() => {
    setSearchTerm("");
  }, [step]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Filtrar items según el step actual
  const filteredItems = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (step === "provincia") {
      if (!search) return provincias;
      return provincias.filter((p) => p.nombre.toLowerCase().includes(search));
    }

    if (step === "localidad") {
      const items = search
        ? localidades.filter((l) => l.nombre.toLowerCase().includes(search))
        : localidades;
      return items.slice(0, 200);
    }

    return [];
  }, [step, searchTerm, provincias, localidades]);

  if (!isOpen) return null;

  const handleSelectProvincia = (nombre: string) => {
    handleProvinciaChange(nombre);
    setStep("localidad");
  };

  const handleSelectLocalidad = (nombre: string) => {
    handleLocalidadChange(nombre);
    setStep("confirm");
  };

  const handleBack = () => {
    if (step === "localidad") {
      handleProvinciaChange("");
      setStep("provincia");
    } else if (step === "confirm") {
      handleLocalidadChange("");
      setStep("localidad");
    }
  };

  const handleConfirm = () => {
    const location = getFormattedLocation();
    if (!location) return;
    onConfirm(location);
  };

  const isLoading =
    (step === "provincia" && provinciasLoading) ||
    (step === "localidad" && localidadesLoading);

  const error =
    (step === "provincia" && provinciasError) ||
    (step === "localidad" && localidadesError);

  const getPlaceholder = () => {
    if (step === "provincia") return "Buscar provincia...";
    if (step === "localidad") return `Buscar en ${selectedProvincia}...`;
    return "";
  };

  const getTitle = () => {
    if (step === "provincia") return "Seleccioná una provincia";
    if (step === "localidad") return "Seleccioná la localidad";
    return "Confirmar ubicación";
  };

  return (
    <Fragment>
      {/* Backdrop - solo visible en desktop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden md:block"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 z-50 md:flex md:items-start md:justify-center md:pt-[10vh] md:px-4"
        onClick={handleClose}
      >
        {/* Modal - Fullscreen en mobile, centered en desktop */}
        <div
          className="h-full w-full md:h-auto md:max-h-[80vh] md:w-full md:max-w-xl bg-gray-900 md:rounded-2xl shadow-2xl md:border md:border-gray-700/50 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 px-4 py-4 md:py-3 border-b border-gray-800 bg-gray-900 safe-area-top">
            <div className="flex items-center justify-between gap-3">
              {/* Back button / Title */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {step !== "provincia" ? (
                  <button
                    onClick={handleBack}
                    className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-xl md:rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors flex-shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5 md:w-4 md:h-4" />
                  </button>
                ) : (
                  <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-xl md:rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 md:w-4 md:h-4 text-white" />
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-white font-bold text-lg md:text-base truncate">
                    {step === "provincia" ? "Reportar perdida" : getTitle()}
                  </h2>
                  <p className="text-gray-500 text-sm md:text-xs truncate">
                    {step === "provincia" ? petName : `${petName} • Paso ${step === "localidad" ? "2" : "3"} de 3`}
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-xl md:rounded-lg bg-gray-800 text-gray-500 hover:text-white hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Input - Solo en pasos de selección */}
          {step !== "confirm" && (
            <div className="flex-shrink-0 px-4 py-3 border-b border-gray-800 bg-gray-900/50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full pl-12 pr-12 py-4 md:py-3 bg-gray-800 rounded-xl text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {step === "localidad" && !localidadesLoading && localidades.length > 0 && (
                <p className="text-xs text-gray-500 mt-2 px-1">
                  {searchTerm 
                    ? `${filteredItems.length} resultados`
                    : `${localidades.length.toLocaleString()} localidades disponibles`
                  }
                </p>
              )}
            </div>
          )}

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                </div>
                <p className="text-gray-400">
                  {step === "provincia"
                    ? "Cargando provincias..."
                    : "Cargando localidades..."}
                </p>
              </div>
            )}

            {/* Error state */}
            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-red-400 text-center">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Provincia list */}
            {step === "provincia" && !isLoading && !error && (
              <>
                {filteredItems.length > 0 ? (
                  <div className="py-2">
                    {(filteredItems as typeof provincias).map((provincia) => (
                      <button
                        key={provincia.id}
                        onClick={() => handleSelectProvincia(provincia.nombre)}
                        className="w-full px-4 py-4 md:py-3 flex items-center justify-between text-left active:bg-gray-800 md:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-4 md:gap-3">
                          <div className="w-12 h-12 md:w-10 md:h-10 bg-gray-800 rounded-xl md:rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 md:w-4 md:h-4 text-orange-400" />
                          </div>
                          <span className="text-white font-medium text-base md:text-sm">
                            {provincia.nombre}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center px-6">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-500">No se encontraron provincias</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Probá con otro término
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Localidad list */}
            {step === "localidad" && !isLoading && !error && (
              <>
                {filteredItems.length > 0 ? (
                  <div className="py-2">
                    {(filteredItems as typeof localidades).map((localidad) => (
                      <button
                        key={localidad.id}
                        onClick={() => handleSelectLocalidad(localidad.nombre)}
                        className="w-full px-4 py-4 md:py-3 flex items-center justify-between text-left active:bg-gray-800 md:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-4 md:gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 md:w-10 md:h-10 bg-gray-800 rounded-xl md:rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 md:w-4 md:h-4 text-orange-400" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-white font-medium text-base md:text-sm block truncate">
                              {localidad.nombre}
                            </span>
                            {localidad.departamento?.nombre && (
                              <span className="text-gray-500 text-sm md:text-xs">
                                {localidad.departamento.nombre}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0 ml-2" />
                      </button>
                    ))}
                    {localidades.length > 200 && !searchTerm && (
                      <div className="px-4 py-4 text-center text-sm text-gray-500 border-t border-gray-800 bg-gray-900/50">
                        Escribí para buscar entre todas las localidades
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-20 text-center px-6">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-500">No se encontraron localidades</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Probá con otro término de búsqueda
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Confirm step */}
            {step === "confirm" && (
              <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                {/* Success animation */}
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
                  <MapPin className="w-10 h-10 text-white" />
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                    Ubicación seleccionada
                  </p>
                  <h3 className="text-2xl md:text-xl font-bold text-white mb-1">
                    {selectedLocalidad}
                  </h3>
                  <p className="text-orange-400 text-lg md:text-base">
                    {selectedProvincia}
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 max-w-sm w-full">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Esta información se mostrará públicamente para ayudar a encontrar a{" "}
                      <span className="text-orange-400 font-medium">{petName}</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-800 bg-gray-900 safe-area-bottom">
            {step === "confirm" ? (
              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-4 md:py-3 rounded-xl text-base md:text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 active:bg-gray-700 transition-colors"
                >
                  Cambiar ubicación
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!isComplete}
                  className="flex-1 py-4 md:py-3 rounded-xl text-base md:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:from-orange-600 active:to-amber-600 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50"
                >
                  Confirmar
                </button>
              </div>
            ) : (
              <button
                onClick={handleClose}
                className="w-full py-4 md:py-3 rounded-xl text-base md:text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 active:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ReportLostModal;
