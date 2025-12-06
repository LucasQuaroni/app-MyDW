import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  type Dispatch,
} from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { RootState } from "../../store/store";
import { auth } from "../../firebase/config";
import { api } from "../../config/axios";

// Define the shape of our user data
export interface AuthUser {
  uid: string;
  email: string | null;
  token: string;
  role?: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

// Register new user
export const registerUser = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    // Create user via API
    await api.post("/users", {
      email,
      password,
    });

    // Automatically log in the user after registration
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const token = await user.getIdToken();
    localStorage.setItem("token", token);

    return {
      uid: user.uid,
      email: user.email,
      token,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || "Registration failed");
  }
});

// Login existing user
export const loginUser = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const token = await user.getIdToken();
    localStorage.setItem("token", token);

    return {
      uid: user.uid,
      email: user.email,
      token,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || "Login failed");
  }
});

// Login with Google
export const loginWithGoogle = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>("auth/loginWithGoogle", async (_, { rejectWithValue }) => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    const user = userCredential.user;
    const token = await user.getIdToken();
    localStorage.setItem("token", token);

    return {
      uid: user.uid,
      email: user.email,
      token,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || "Google login failed");
  }
});

// Logout user
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

// Observe Firebase user state
export const observeUser = createAsyncThunk<void, void, { dispatch: Dispatch }>(
  "auth/observeUser",
  async (_, { dispatch }) => {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, async (user: User | null) => {
        try {
          if (user) {
            const token = await user.getIdToken();
            localStorage.setItem("token", token);
            dispatch(setUser({ uid: user.uid, email: user.email, token }));
          } else {
            localStorage.removeItem("token");
            dispatch(clearUser());
          }
        } catch (error) {
          console.error("Error in auth observer:", error);
        } finally {
          dispatch(setLoading(false));
          resolve(); // Resolve on first auth state check
        }
      });
    });
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // Login with Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google login failed";
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      })

      // Observe user - handle when the observer is initiated
      .addCase(observeUser.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const getAuthState = (state: RootState) => state.auth;
export default authSlice.reducer;
