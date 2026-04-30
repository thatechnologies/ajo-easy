import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { apiListGroups, apiLogin, apiMe, apiSignup, readAccessToken, writeAccessToken, type KycStatus } from "@/lib/ajo-data";

interface AuthCtx {
  user: LocalUser | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (input: { email: string; password: string; fullName: string; phone: string }) => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  markAdmin: () => void;
  refreshAdmin: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

type LocalUser = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  kyc_status: KycStatus;
};

const AUTH_USER_KEY = "kowope:auth:user";

const readCurrentUser = (): LocalUser | null => {
  try {
    const raw = window.localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LocalUser>;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.id || !parsed.email || !parsed.full_name || !parsed.phone) return null;
    return {
      id: parsed.id,
      email: parsed.email,
      full_name: parsed.full_name,
      phone: parsed.phone,
      kyc_status: (parsed.kyc_status as LocalUser["kyc_status"]) ?? "unverified",
    };
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
  isAdmin: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  markAdmin: () => {},
  refreshAdmin: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshUser = useCallback(async () => {
    const res = await apiMe();
    writeCurrentUser(res.user);
    setUser(res.user);
  }, []);

  const refreshAdmin = useCallback(async () => {
    try {
      const groups = await apiListGroups();
      setIsAdmin(groups.some((g) => g.isAdmin));
    } catch {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    const token = readAccessToken();
    if (!token) {
      writeCurrentUser(null);
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    refreshUser()
      .then(() => refreshAdmin())
      .catch(() => {
        writeAccessToken(null);
        writeCurrentUser(null);
        setUser(null);
        setIsAdmin(false);
      })
      .finally(() => setLoading(false));
  }, [refreshAdmin, refreshUser]);

  const api = useMemo(() => {
    const signUp: AuthCtx["signUp"] = async ({ email, password, fullName, phone }) => {
      const res = await apiSignup({ email, password, fullName, phone });
      writeAccessToken(res.token);
      writeCurrentUser(res.user);
      setUser(res.user);
      await refreshAdmin();
    };

    const signIn: AuthCtx["signIn"] = async ({ email, password }) => {
      const res = await apiLogin({ email, password });
      writeAccessToken(res.token);
      writeCurrentUser(res.user);
      setUser(res.user);
      await refreshAdmin();
    };

    const signOut: AuthCtx["signOut"] = async () => {
      writeAccessToken(null);
      writeCurrentUser(null);
      setUser(null);
      setIsAdmin(false);
    };

    return { signUp, signIn, signOut };
  }, [refreshAdmin]);

  const signOut = async () => {
    await api.signOut();
  };

  const markAdmin = () => setIsAdmin(true);

  return (
    <Ctx.Provider value={{ user, loading, isAdmin, signUp: api.signUp, signIn: api.signIn, signOut, markAdmin, refreshAdmin, refreshUser }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
