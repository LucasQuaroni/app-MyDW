import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/axios";
import IPets, { TagInfo, CreatePetData } from "../../types/PetsType";
import { selectUser } from "../auth/authSlice";
import { RootState } from "../../store/store";

export const fetchPets = createAsyncThunk<
  IPets[],
  void,
  { rejectValue: string; state: RootState }
>("pets/getAllPets", async (_, { rejectWithValue, getState }) => {
  try {
    const user = selectUser(getState());
    if (!user) {
      return rejectWithValue("Usuario no autenticado");
    }
    const response = await api.get(`/pets/owner/${user.uid}`);
    // Asegurar que siempre devolvamos un array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error al cargar las mascotas"
    );
  }
});

export const createPet = createAsyncThunk<
  IPets,
  CreatePetData,
  { rejectValue: string }
>("pets/createPet", async (pet, { rejectWithValue }) => {
  try {
    const response = await api.post("/pets", pet);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error al crear la mascota"
    );
  }
});

export const updatePet = createAsyncThunk<
  IPets,
  { id: string; data: Partial<IPets> },
  { rejectValue: string }
>("pets/updatePet", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/pets/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al actualizar la mascota"
    );
  }
});

export const deletePet = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("pets/deletePet", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/pets/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al eliminar la mascota"
    );
  }
});

export const fetchTagInfo = createAsyncThunk<
  TagInfo,
  string, // tagId
  { rejectValue: string }
>("pets/fetchTagInfo", async (tagId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/tags/info/${tagId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        "Error al cargar la información de la chapita"
    );
  }
});

// Fetch available pets (pets without tags) for tag activation
export const fetchAvailablePets = createAsyncThunk<
  IPets[],
  void,
  { rejectValue: string; state: RootState }
>("pets/fetchAvailablePets", async (_, { rejectWithValue, getState }) => {
  try {
    const user = selectUser(getState());
    if (!user) {
      return rejectWithValue("Usuario no autenticado");
    }
    const response = await api.get(`/pets?ownerId=${user.uid}`);
    // Filter pets without associated tag
    const availablePets = response.data.filter((pet: IPets) => !pet.tagId);
    return availablePets;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        "Error al cargar las mascotas disponibles"
    );
  }
});

// Activate a tag (link tag to a pet)
export const activateTag = createAsyncThunk<
  { tagInfo: TagInfo; petId: string },
  { tagId: string; petId: string },
  { rejectValue: string }
>("pets/activateTag", async ({ tagId, petId }, { rejectWithValue }) => {
  try {
    await api.post(`/tags/activate/${tagId}`, { petId });
    // After activation, fetch updated tag info
    const response = await api.get(`/tags/info/${tagId}`);
    return { tagInfo: response.data, petId };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Error al activar la chapita"
    );
  }
});

export const toggleLostStatus = createAsyncThunk<
  IPets,
  { id: string; isLost: boolean; lostLocation?: string },
  { rejectValue: string }
>("pets/toggleLostStatus", async ({ id, isLost, lostLocation }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/pets/${id}/lost`, { isLost, lostLocation });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Error al actualizar el estado de la mascota"
    );
  }
});

export const fetchLostPets = createAsyncThunk<
  IPets[],
  void,
  { rejectValue: string }
>("pets/fetchLostPets", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/pets/lost");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error al cargar las mascotas perdidas"
    );
  }
});

// Fetch a single pet by ID
export const fetchPetById = createAsyncThunk<
  IPets,
  string, // petId
  { rejectValue: string }
>("pets/fetchPetById", async (petId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/pets/${petId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error al cargar la mascota"
    );
  }
});

const petsSlice = createSlice({
  name: "pets",
  initialState: {
    pets: [] as IPets[],
    loading: false,
    error: null as string | null,
    success: null as string | null,
    // Current pet (for detail/edit views)
    currentPet: null as IPets | null,
    currentPetLoading: false,
    currentPetError: null as string | null,
    // Tag-related state
    tagInfo: null as TagInfo | null,
    tagLoading: false,
    tagError: null as string | null,
    // Available pets for tag activation
    availablePets: [] as IPets[],
    availablePetsLoading: false,
    availablePetsError: null as string | null,
    // Tag activation state
    activating: false,
    activationError: null as string | null,
    // Lost pets state
    lostPets: [] as IPets[],
    lostPetsLoading: false,
    lostPetsError: null as string | null,
  },
  reducers: {
    setPets: (state, action: PayloadAction<IPets[]>) => {
      state.pets = action.payload;
    },
    clearTagInfo: (state) => {
      state.tagInfo = null;
      state.tagError = null;
    },
    clearCurrentPet: (state) => {
      state.currentPet = null;
      state.currentPetError = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.success = null;
      state.tagError = null;
      state.availablePetsError = null;
      state.activationError = null;
      state.lostPetsError = null;
      state.currentPetError = null;
    },
    clearPetMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPets.fulfilled, (state, action) => {
      state.loading = false;
      // Asegurar que siempre sea un array
      state.pets = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchPets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Error al cargar las mascotas";
      // Asegurar que pets siempre sea un array incluso en caso de error
      if (!Array.isArray(state.pets)) {
        state.pets = [];
      }
    });
    builder.addCase(createPet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPet.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = "¡Mascota registrada exitosamente!";
      state.pets = [...state.pets, action.payload];
    });
    builder.addCase(createPet.rejected, (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = action.payload ?? "Error al crear la mascota";
    });
    // updatePet handlers
    builder.addCase(updatePet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePet.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.pets.findIndex(
        (pet) => pet._id === action.payload._id
      );
      if (index !== -1) {
        state.pets[index] = action.payload;
      }
    });
    builder.addCase(updatePet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Error al actualizar la mascota";
    });
    // deletePet handlers
    builder.addCase(deletePet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePet.fulfilled, (state, action) => {
      state.loading = false;
      state.pets = state.pets.filter((pet) => pet._id !== action.payload);
    });
    builder.addCase(deletePet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Error al eliminar la mascota";
    });
    // fetchTagInfo handlers
    builder.addCase(fetchTagInfo.pending, (state) => {
      state.tagLoading = true;
      state.tagError = null;
    });
    builder.addCase(fetchTagInfo.fulfilled, (state, action) => {
      state.tagLoading = false;
      state.tagInfo = action.payload;
    });
    builder.addCase(fetchTagInfo.rejected, (state, action) => {
      state.tagLoading = false;
      state.tagError =
        action.payload ?? "Error al cargar la información de la chapita";
    });
    // fetchAvailablePets handlers
    builder.addCase(fetchAvailablePets.pending, (state) => {
      state.availablePetsLoading = true;
      state.availablePetsError = null;
    });
    builder.addCase(fetchAvailablePets.fulfilled, (state, action) => {
      state.availablePetsLoading = false;
      state.availablePets = action.payload;
    });
    builder.addCase(fetchAvailablePets.rejected, (state, action) => {
      state.availablePetsLoading = false;
      state.availablePetsError =
        action.payload ?? "Error al cargar las mascotas disponibles";
    });
    // activateTag handlers
    builder.addCase(activateTag.pending, (state) => {
      state.activating = true;
      state.activationError = null;
    });
    builder.addCase(activateTag.fulfilled, (state, action) => {
      state.activating = false;
      state.tagInfo = action.payload.tagInfo;
      // Remove the pet from available pets since it now has a tag
      state.availablePets = state.availablePets.filter(
        (pet) => pet._id !== action.payload.petId
      );
    });
    builder.addCase(activateTag.rejected, (state, action) => {
      state.activating = false;
      state.activationError = action.payload ?? "Error al activar la chapita";
    });
    // toggleLostStatus handlers
    builder.addCase(toggleLostStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(toggleLostStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.pets.findIndex(
        (pet) => pet._id === action.payload._id
      );
      if (index !== -1) {
        state.pets[index] = action.payload;
      }
    });
    builder.addCase(toggleLostStatus.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ?? "Error al actualizar el estado de la mascota";
    });
    // fetchLostPets handlers
    builder.addCase(fetchLostPets.pending, (state) => {
      state.lostPetsLoading = true;
      state.lostPetsError = null;
    });
    builder.addCase(fetchLostPets.fulfilled, (state, action) => {
      state.lostPetsLoading = false;
      state.lostPets = action.payload;
    });
    builder.addCase(fetchLostPets.rejected, (state, action) => {
      state.lostPetsLoading = false;
      state.lostPetsError =
        action.payload ?? "Error al cargar las mascotas perdidas";
    });
    // fetchPetById handlers
    builder.addCase(fetchPetById.pending, (state) => {
      state.currentPetLoading = true;
      state.currentPetError = null;
    });
    builder.addCase(fetchPetById.fulfilled, (state, action) => {
      state.currentPetLoading = false;
      state.currentPet = action.payload;
    });
    builder.addCase(fetchPetById.rejected, (state, action) => {
      state.currentPetLoading = false;
      state.currentPetError = action.payload ?? "Error al cargar la mascota";
    });
  },
});

export const {
  setPets,
  clearTagInfo,
  clearCurrentPet,
  clearErrors,
  clearPetMessages,
} = petsSlice.actions;
export default petsSlice.reducer;
