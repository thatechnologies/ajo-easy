import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { apiLogin, apiMe, apiSignup, readAccessToken, writeAccessToken } from "@/lib/ajo-data";

interface AuthCtx {
  user: LocalUser | null;
  loading: boolean;
  signUp: (input: { email: string; password: string; fullName: string; phone: string }) => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

type LocalUser = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
};

const AUTH_USER_KEY = "kowope:auth:user";

const readCurrentUser = (): LocalUser | null => {
  try {
    const raw = window.localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocalUser;
  } catch {
    return null;
  }
};

const writeCurrentUser = (user: LocalUser | null) => {
  if (!user) {
    window.localStorage.removeItem(AUTH_USER_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = readAccessToken();
    if (!token) {
      setUser(readCurrentUser());
      setLoading(false);
      return;
    }

    apiMe()
      .then((res) => {
        writeCurrentUser(res.user);
        setUser(res.user);
      })
      .catch(() => {
        writeAccessToken(null);
        writeCurrentUser(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const api = useMemo(() => {
    const signUp: AuthCtx["signUp"] = async ({ email, password, fullName, phone }) => {
      const res = await apiSignup({ email, password, fullName, phone });
      writeAccessToken(res.token);
      writeCurrentUser(res.user);
      setUser(res.user);
    };

    const signIn: AuthCtx["signIn"] = async ({ email, password }) => {
      const res = await apiLogin({ email, password });
      writeAccessToken(res.token);
      writeCurrentUser(res.user);
      setUser(res.user);
    };

    const signOut: AuthCtx["signOut"] = async () => {
      writeAccessToken(null);
      writeCurrentUser(null);
      setUser(null);
    };

    return { signUp, signIn, signOut };
  }, []);

  const signOut = async () => {
    await api.signOut();
  };

  return <Ctx.Provider value={{ user, loading, signUp: api.signUp, signIn: api.signIn, signOut }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
