import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/axios";
import IPets, { TagInfo } from "../../types/PetsType";
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
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error al cargar las mascotas"
    );
  }
});

export const createPet = createAsyncThunk<
  IPets,
  IPets,
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

// Fetch tag information by tagId (QR code)
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

const petsSlice = createSlice({
  name: "pets",
  initialState: {
    pets: [] as IPets[],
    loading: false,
    error: null as string | null,
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
  },
  reducers: {
    setPets: (state, action: PayloadAction<IPets[]>) => {
      state.pets = action.payload;
    },
    clearTagInfo: (state) => {
      state.tagInfo = null;
      state.tagError = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.tagError = null;
      state.availablePetsError = null;
      state.activationError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPets.fulfilled, (state, action) => {
      state.loading = false;
      state.pets = action.payload;
    });
    builder.addCase(fetchPets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Error al cargar las mascotas";
    });
    builder.addCase(createPet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPet.fulfilled, (state, action) => {
      state.loading = false;
      state.pets = [...state.pets, action.payload];
    });
    builder.addCase(createPet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Error al crear la mascota";
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
  },
});

export const { setPets, clearTagInfo, clearErrors } = petsSlice.actions;
export default petsSlice.reducer;
