import { useState, useEffect, useCallback } from "react";

// Tipos para la API de Georef Argentina
export interface Provincia {
  id: string;
  nombre: string;
}

export interface Localidad {
  id: string;
  nombre: string;
  provincia: {
    id: string;
    nombre: string;
  };
  departamento: {
    id: string;
    nombre: string;
  };
}

interface GeorefProvinciasResponse {
  provincias: Provincia[];
  cantidad: number;
  total: number;
}

interface GeorefLocalidadesResponse {
  localidades: Localidad[];
  cantidad: number;
  total: number;
}

const GEOREF_BASE_URL = "https://apis.datos.gob.ar/georef/api";

/**
 * Hook para obtener provincias de Argentina desde la API de Georef
 */
export const useProvincias = () => {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvincias = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${GEOREF_BASE_URL}/provincias?orden=nombre&max=100`
        );

        if (!response.ok) {
          throw new Error("Error al obtener las provincias");
        }

        const data: GeorefProvinciasResponse = await response.json();
        setProvincias(data.provincias);
      } catch (err) {
        console.error("Error fetching provincias:", err);
        setError(
          err instanceof Error ? err.message : "Error al cargar las provincias"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProvincias();
  }, []);

  return { provincias, loading, error };
};

/**
 * Hook para obtener localidades de una provincia específica desde la API de Georef
 */
export const useLocalidades = (provinciaNombre: string) => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocalidades = useCallback(async () => {
    if (!provinciaNombre) {
      setLocalidades([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Usamos max=5000 para obtener todas las localidades de la provincia
      // La API de Georef permite hasta 5000 resultados por consulta
      const response = await fetch(
        `${GEOREF_BASE_URL}/localidades?provincia=${encodeURIComponent(
          provinciaNombre
        )}&max=5000&orden=nombre`
      );

      if (!response.ok) {
        throw new Error("Error al obtener las localidades");
      }

      const data: GeorefLocalidadesResponse = await response.json();
      
      // Eliminar duplicados por nombre (algunas localidades aparecen repetidas)
      const uniqueLocalidades = data.localidades.reduce((acc, localidad) => {
        const exists = acc.find(
          (l) => l.nombre.toLowerCase() === localidad.nombre.toLowerCase()
        );
        if (!exists) {
          acc.push(localidad);
        }
        return acc;
      }, [] as Localidad[]);

      setLocalidades(uniqueLocalidades);
    } catch (err) {
      console.error("Error fetching localidades:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar las localidades"
      );
    } finally {
      setLoading(false);
    }
  }, [provinciaNombre]);

  useEffect(() => {
    fetchLocalidades();
  }, [fetchLocalidades]);

  return { localidades, loading, error, refetch: fetchLocalidades };
};

/**
 * Hook combinado para manejar la selección de provincia y localidad
 */
export const useGeorefArgentina = () => {
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState("");

  const {
    provincias,
    loading: provinciasLoading,
    error: provinciasError,
  } = useProvincias();

  const {
    localidades,
    loading: localidadesLoading,
    error: localidadesError,
  } = useLocalidades(selectedProvincia);

  // Limpiar localidad cuando cambia la provincia
  const handleProvinciaChange = useCallback((provincia: string) => {
    setSelectedProvincia(provincia);
    setSelectedLocalidad("");
  }, []);

  const handleLocalidadChange = useCallback((localidad: string) => {
    setSelectedLocalidad(localidad);
  }, []);

  // Resetear ambos valores
  const reset = useCallback(() => {
    setSelectedProvincia("");
    setSelectedLocalidad("");
  }, []);

  // Obtener la ubicación formateada
  const getFormattedLocation = useCallback(() => {
    if (!selectedLocalidad || !selectedProvincia) return "";
    return `${selectedLocalidad}, ${selectedProvincia}`;
  }, [selectedLocalidad, selectedProvincia]);

  return {
    // Provincias
    provincias,
    provinciasLoading,
    provinciasError,
    selectedProvincia,
    handleProvinciaChange,

    // Localidades
    localidades,
    localidadesLoading,
    localidadesError,
    selectedLocalidad,
    handleLocalidadChange,

    // Utilidades
    reset,
    getFormattedLocation,
    isComplete: !!selectedProvincia && !!selectedLocalidad,
  };
};

export default useGeorefArgentina;
