import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AxiosResponse } from "axios";
import { authAPI } from "../services/api";
import type {
  AuthUser,
  LoginCredentials,
  RegisterData,
  User,
  ApiResponse,
} from "../types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: AuthUser; token: string } }
  | { type: "AUTH_FAIL" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: AuthUser }
  | { type: "SET_INITIALIZED" };

interface AuthContextType extends AuthState {
  login: (
    credentials: LoginCredentials
  ) => Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>>;
  register: (
    userData: RegisterData
  ) => Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>>;
  logout: () => void;
  updateUser: (userData: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  console.log(
    "AuthReducer: Action dispatched:",
    action.type,
    action.type === "AUTH_SUCCESS"
      ? {
          hasPayload: !!action.payload,
          hasUser: !!action.payload?.user,
          hasToken: !!action.payload?.token,
          tokenLength: action.payload?.token?.length,
        }
      : {}
  );

  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true };
    case "AUTH_SUCCESS":
      const newState = {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        isInitialized: true,
        user: action.payload.user,
        token: action.payload.token,
      };
      console.log("AuthReducer: AUTH_SUCCESS new state:", {
        hasUser: !!newState.user,
        hasToken: !!newState.token,
        tokenValue: newState.token,
      });
      return newState;
    case "AUTH_FAIL":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        isInitialized: true,
        user: null,
        token: null,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        isInitialized: true,
        user: null,
        token: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_INITIALIZED":
      return {
        ...state,
        isLoading: false,
        isInitialized: true,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true, // Start with loading true
  isAuthenticated: false,
  isInitialized: false,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const logout = useCallback(() => {
    console.log("AuthProvider: Logging out...");
    localStorage.removeItem("driverxp_token");
    localStorage.removeItem("driverxp_user");
    dispatch({ type: "LOGOUT" });
  }, []);

  // Check for existing token on mount
  useEffect(() => {
    console.log("AuthProvider: Initializing auth check...");
    const token = localStorage.getItem("driverxp_token");
    const userStr = localStorage.getItem("driverxp_user");

    if (token && userStr) {
      try {
        console.log("AuthProvider: Found existing auth data");
        const user = JSON.parse(userStr);

        // Validate the user object has required fields
        if (user && user.id && user.firstName && user.email) {
          console.log("AuthProvider: Auth data is valid, restoring session");
          dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });
        } else {
          console.log("AuthProvider: Invalid user data, clearing storage");
          localStorage.removeItem("driverxp_token");
          localStorage.removeItem("driverxp_user");
          dispatch({ type: "SET_INITIALIZED" });
        }
      } catch (error) {
        console.log("AuthProvider: Error parsing stored auth data", error);
        localStorage.removeItem("driverxp_token");
        localStorage.removeItem("driverxp_user");
        dispatch({ type: "SET_INITIALIZED" });
      }
    } else {
      console.log("AuthProvider: No existing auth data found");
      dispatch({ type: "SET_INITIALIZED" });
    }
  }, []);

  // Listen for logout events from API interceptor
  useEffect(() => {
    const handleLogoutEvent = () => {
      console.log("AuthProvider: Received logout event from API");
      logout();
    };

    window.addEventListener("auth:logout", handleLogoutEvent);
    return () => {
      window.removeEventListener("auth:logout", handleLogoutEvent);
    };
  }, [logout]);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log("AuthProvider: Starting login process...");
      dispatch({ type: "AUTH_START" });
      const response = await authAPI.login(credentials);

      // ADD THIS DEBUGGING
      console.log("AuthProvider: Raw response from API:", response);
      console.log("AuthProvider: response.data:", response.data);
      console.log("AuthProvider: response.data.data:", response.data.data);
      console.log(
        "AuthProvider: response.data.token:",
        (response.data as any).token
      );

      const user = response.data.data?.user;
      const token = (response.data as any).token; // CHANGED: token is at response.data.token

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

      console.log("AuthProvider: Login successful", {
        userId: user.id,
        userRole: user.role,
        userName: user.firstName,
        tokenLength: token.length,
        tokenStart: token.substring(0, 10),
      });

      // Store in localStorage first
      localStorage.setItem("driverxp_token", token);
      localStorage.setItem("driverxp_user", JSON.stringify(user));

      console.log("AuthProvider: Stored in localStorage:", {
        tokenStored:
          localStorage.getItem("driverxp_token")?.substring(0, 10) + "...",
        userStored: !!localStorage.getItem("driverxp_user"),
      });

      // Then update state
      dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });

      console.log("AuthProvider: Login process complete");
      return response;
    } catch (error) {
      console.log("AuthProvider: Login failed", error);
      dispatch({ type: "AUTH_FAIL" });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      console.log("AuthProvider: Starting registration process...");
      dispatch({ type: "AUTH_START" });
      const response = await authAPI.register(userData);
      const user = response.data.data?.user;
      const token = (response.data as any).token; // CHANGED: token is at response.data.token

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

      // Store in localStorage first
      localStorage.setItem("driverxp_token", token);
      localStorage.setItem("driverxp_user", JSON.stringify(user));

      // Then update state
      dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });
      return response;
    } catch (error) {
      console.log("AuthProvider: Registration failed", error);
      dispatch({ type: "AUTH_FAIL" });
      throw error;
    }
  };

  const updateUser = (userData: AuthUser) => {
    localStorage.setItem("driverxp_user", JSON.stringify(userData));
    dispatch({ type: "UPDATE_USER", payload: userData });
  };

  // Don't render children until auth is initialized
  if (!state.isInitialized) {
    console.log("AuthProvider: Still initializing...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">
          Initializing DriverXP...
        </div>
      </div>
    );
  }

  console.log("AuthProvider: Rendering with state:", {
    hasUser: !!state.user,
    hasToken: !!state.token,
    tokenValue: state.token ? `${state.token.substring(0, 10)}...` : "null",
    isAuthenticated: state.isAuthenticated,
    isInitialized: state.isInitialized,
    userRole: state.user?.role,
  });

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
