import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";


const AuthContext =
  createContext(null);


function readStoredUser() {
  try {
    const saved =
      localStorage.getItem(
        "nerva_user"
      );

    if (!saved) {
      return null;
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error(
      "Unable to restore NERVA user:",
      error
    );

    localStorage.removeItem(
      "nerva_user"
    );

    return null;
  }
}


export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(readStoredUser);


  function login(
    userData,
    token = null
  ) {
    if (!userData) {
      return;
    }

    setUser(userData);

    localStorage.setItem(
      "nerva_user",
      JSON.stringify(userData)
    );

    if (token) {
      localStorage.setItem(
        "nerva_token",
        token
      );
    }
  }


  function logout() {
    setUser(null);

    localStorage.removeItem(
      "nerva_user"
    );

    localStorage.removeItem(
      "nerva_token"
    );
  }


  const isAuthenticated =
    Boolean(user);


  const role =
    user?.role || null;


  const isCityCommand =
    role === "city_command";


  const isFieldTeam =
    role === "field_team";


  const isCitizen =
    role === "citizen";


  const value =
    useMemo(
      () => ({
        user,

        role,

        isAuthenticated,

        isCityCommand,

        isFieldTeam,

        isCitizen,

        login,

        logout,
      }),
      [
        user,
        role,
        isAuthenticated,
        isCityCommand,
        isFieldTeam,
        isCitizen,
      ]
    );


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}