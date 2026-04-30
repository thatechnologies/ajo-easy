// Mock data layer for the Ajo app

export interface Member {
  id: string;
  name: string;
  phone: string;
  paid: boolean;
<<<<<<< HEAD
  paymentStatus?: "none" | "pending" | "confirmed" | "rejected";
=======
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
  receivedPayout: boolean;
  payoutPosition: number;
  isAdmin?: boolean;
}

export interface Group {
  id: string;
  name: string;
  amount: number;
  frequency: "Weekly" | "Monthly";
  totalMembers: number;
  currentCycle: number;
  nextPayoutDate: string;
  nextPayoutMember: string;
<<<<<<< HEAD
  nextPayoutMemberId?: string | null;
=======
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
  members: Member[];
  inviteCode: string;
  totalContributed: number;
  myContribution: number;
  paidThisCycle: number;
<<<<<<< HEAD
  confirmedThisCycle?: number;
  myPaidThisCycle?: boolean;
  startDate: string;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankAccountName?: string | null;
  isAdmin?: boolean;
  payoutPosition?: number;
=======
  startDate: string;
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
}

export const mockGroups: Group[] = [
  {
    id: "1",
    name: "Balogun Market Traders",
    amount: 20000,
    frequency: "Weekly",
    totalMembers: 8,
    currentCycle: 4,
    nextPayoutDate: "Fri, 26 Apr",
    nextPayoutMember: "Adaeze Nwosu",
    inviteCode: "AJO-BMT8",
    totalContributed: 480000,
    myContribution: 80000,
    paidThisCycle: 6,
    startDate: "12 Mar 2026",
    members: [
      { id: "m1", name: "Tunde Adekunle", phone: "+234 803 111 1111", paid: true, receivedPayout: true, payoutPosition: 1, isAdmin: true },
      { id: "m2", name: "Bisi Ogundimu", phone: "+234 803 222 2222", paid: true, receivedPayout: true, payoutPosition: 2 },
      { id: "m3", name: "Chidi Okonkwo", phone: "+234 803 333 3333", paid: true, receivedPayout: true, payoutPosition: 3 },
      { id: "m4", name: "Adaeze Nwosu", phone: "+234 803 444 4444", paid: true, receivedPayout: false, payoutPosition: 4 },
      { id: "m5", name: "Femi Akinwale", phone: "+234 803 555 5555", paid: true, receivedPayout: false, payoutPosition: 5 },
      { id: "m6", name: "Grace Eze", phone: "+234 803 666 6666", paid: true, receivedPayout: false, payoutPosition: 6 },
      { id: "m7", name: "Ibrahim Yusuf", phone: "+234 803 777 7777", paid: false, receivedPayout: false, payoutPosition: 7 },
      { id: "m8", name: "You", phone: "+234 803 888 8888", paid: false, receivedPayout: false, payoutPosition: 8 },
    ],
  },
  {
    id: "2",
    name: "Family Savings Circle",
    amount: 50000,
    frequency: "Monthly",
    totalMembers: 6,
    currentCycle: 2,
    nextPayoutDate: "1 May",
    nextPayoutMember: "You",
    inviteCode: "AJO-FAM6",
    totalContributed: 600000,
    myContribution: 100000,
    paidThisCycle: 5,
    startDate: "1 Mar 2026",
    members: [
      { id: "f1", name: "Mama Ngozi", phone: "+234 803 100 1001", paid: true, receivedPayout: true, payoutPosition: 1, isAdmin: true },
      { id: "f2", name: "Uncle Emeka", phone: "+234 803 100 1002", paid: true, receivedPayout: false, payoutPosition: 2 },
      { id: "f3", name: "You", phone: "+234 803 888 8888", paid: true, receivedPayout: false, payoutPosition: 3 },
      { id: "f4", name: "Cousin Tobi", phone: "+234 803 100 1004", paid: true, receivedPayout: false, payoutPosition: 4 },
      { id: "f5", name: "Aunty Kemi", phone: "+234 803 100 1005", paid: true, receivedPayout: false, payoutPosition: 5 },
      { id: "f6", name: "Sister Joy", phone: "+234 803 100 1006", paid: false, receivedPayout: false, payoutPosition: 6 },
    ],
  },
  {
    id: "3",
    name: "Lekki Salon Owners",
    amount: 15000,
    frequency: "Weekly",
    totalMembers: 5,
    currentCycle: 1,
    nextPayoutDate: "Mon, 29 Apr",
    nextPayoutMember: "Ronke A.",
    inviteCode: "AJO-LSO5",
    totalContributed: 75000,
    myContribution: 15000,
    paidThisCycle: 5,
    startDate: "22 Apr 2026",
    members: [
      { id: "s1", name: "Ronke Adebayo", phone: "+234 803 200 2001", paid: true, receivedPayout: false, payoutPosition: 1, isAdmin: true },
      { id: "s2", name: "Toyin Bello", phone: "+234 803 200 2002", paid: true, receivedPayout: false, payoutPosition: 2 },
      { id: "s3", name: "Funke Ade", phone: "+234 803 200 2003", paid: true, receivedPayout: false, payoutPosition: 3 },
      { id: "s4", name: "You", phone: "+234 803 888 8888", paid: true, receivedPayout: false, payoutPosition: 4 },
      { id: "s5", name: "Blessing O.", phone: "+234 803 200 2005", paid: true, receivedPayout: false, payoutPosition: 5 },
    ],
  },
];

export const getGroupById = (id: string) => mockGroups.find((g) => g.id === id);

export interface Transaction {
  id: string;
  type: "payment" | "payout";
  groupName: string;
  amount: number;
  date: string;
  status: "completed" | "pending";
}

export const mockTransactions: Transaction[] = [
  { id: "t1", type: "payment", groupName: "Family Savings Circle", amount: 50000, date: "Today, 10:24 AM", status: "completed" },
  { id: "t2", type: "payment", groupName: "Lekki Salon Owners", amount: 15000, date: "Yesterday", status: "completed" },
  { id: "t3", type: "payout", groupName: "Balogun Market Traders", amount: 160000, date: "12 Apr", status: "completed" },
  { id: "t4", type: "payment", groupName: "Balogun Market Traders", amount: 20000, date: "5 Apr", status: "completed" },
  { id: "t5", type: "payment", groupName: "Family Savings Circle", amount: 50000, date: "1 Apr", status: "completed" },
];

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "reminder" | "payout" | "missed" | "success";
  unread: boolean;
}

export const mockNotifications: Notification[] = [
  { id: "n1", title: "Payment due tomorrow", message: "Balogun Market Traders — ₦20,000", time: "2h ago", type: "reminder", unread: true },
  { id: "n2", title: "Payout received! 🎉", message: "You received ₦160,000 from Balogun Market Traders", time: "5h ago", type: "payout", unread: true },
  { id: "n3", title: "New member joined", message: "Blessing O. joined Lekki Salon Owners", time: "Yesterday", type: "success", unread: false },
  { id: "n4", title: "Missed payment alert", message: "Ibrahim Y. has not paid this week", time: "Yesterday", type: "missed", unread: false },
  { id: "n5", title: "Cycle complete", message: "Family Savings Circle Cycle 1 has ended", time: "3d ago", type: "success", unread: false },
];
<<<<<<< HEAD

export type LocalContributionStatus = "pending" | "confirmed" | "rejected";

export type LocalContribution = {
  id: string;
  group_id: string;
  member_id: string;
  member_name: string | null;
  cycle_number: number;
  amount: number;
  transaction_reference: string;
  receipt_data_url: string | null;
  status: LocalContributionStatus;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

const CONTRIBUTIONS_STORAGE_KEY = "kowope:contributions";

export const readLocalContributions = (): LocalContribution[] => {
  try {
    const raw = window.localStorage.getItem(CONTRIBUTIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalContribution[]) : [];
  } catch {
    return [];
  }
};

export const writeLocalContributions = (items: LocalContribution[]) => {
  window.localStorage.setItem(CONTRIBUTIONS_STORAGE_KEY, JSON.stringify(items));
};

export const addLocalContribution = (input: Omit<LocalContribution, "id" | "submitted_at" | "status" | "reviewed_at" | "reviewed_by">) => {
  const next: LocalContribution = {
    ...input,
    id: crypto.randomUUID(),
    status: "pending",
    submitted_at: new Date().toISOString(),
    reviewed_at: null,
    reviewed_by: null,
  };
  const items = readLocalContributions();
  writeLocalContributions([next, ...items]);
  return next;
};

export const updateLocalContributionStatus = (id: string, status: LocalContributionStatus, reviewerId: string) => {
  const items = readLocalContributions();
  const next = items.map((c) =>
    c.id === id
      ? { ...c, status, reviewed_at: new Date().toISOString(), reviewed_by: reviewerId }
      : c
  );
  writeLocalContributions(next);
};

const AUTH_TOKEN_KEY = "kowope:auth:token";

export const readAccessToken = () => {
  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const writeAccessToken = (token: string | null) => {
  if (!token) {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:4000").replace(
  /\/$/,
  "",
);

class HttpError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

const apiJson = async <T>(path: string, init?: RequestInit, auth = true): Promise<T> => {
  const token = auth ? readAccessToken() : null;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });

  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = text;
    }
  }
  if (!res.ok) {
    const message =
      typeof body === "object" && body !== null && "error" in body && typeof (body as { error?: unknown }).error === "string"
        ? String((body as { error: string }).error)
        : `HTTP ${res.status}`;
    const err = new HttpError(res.status, body);
    err.message = message;
    throw err;
  }
  return body as T;
};

export type KycStatus = "unverified" | "verified" | "rejected";

type ApiUser = { id: string; email: string; full_name: string; phone: string; kyc_status: KycStatus };

export const apiLogin = async (input: { email: string; password: string }) => {
  return apiJson<{ token: string; user: ApiUser }>("/auth/login", { method: "POST", body: JSON.stringify(input) }, false);
};

export const apiSignup = async (input: { email: string; password: string; fullName: string; phone: string }) => {
  return apiJson<{ token: string; user: ApiUser }>(
    "/auth/signup",
    { method: "POST", body: JSON.stringify(input) },
    false,
  );
};

export const apiMe = async () => {
  return apiJson<{ user: ApiUser }>("/auth/me");
};

export const apiSubmitKyc = async (input: { nin: string; dob: string; ninCardDataUrl: string }) => {
  return apiJson<{ ok: true }>("/auth/kyc", { method: "POST", body: JSON.stringify(input) });
};

export const apiGetKyc = async () => {
  return apiJson<{ kyc: { status: KycStatus; submitted_at: string | null; verified_at: string | null } }>("/auth/kyc");
};

type ApiGroupRow = {
  id: string;
  name: string;
  amount: string | number;
  frequency: "Weekly" | "Monthly";
  total_members: number;
  invite_code: string;
  current_cycle: number;
  start_date: string;
  bank_name?: string | null;
  bank_account_number?: string | null;
  bank_account_name?: string | null;
  is_admin: boolean;
  payout_position: number;
  total_contributed: string | number;
  my_contribution: string | number;
  paid_this_cycle: number;
  confirmed_this_cycle: number;
  i_paid_this_cycle: boolean;
  next_payout_member_id?: string | null;
  next_payout_member: string | null;
  next_payout_date: string | null;
};

const toGroup = (g: ApiGroupRow): Group => {
  return {
    id: g.id,
    name: g.name,
    amount: Number(g.amount),
    frequency: g.frequency,
    totalMembers: g.total_members,
    currentCycle: g.current_cycle,
    nextPayoutDate: g.next_payout_date ?? "—",
    nextPayoutMember: g.next_payout_member ?? "—",
    nextPayoutMemberId: g.next_payout_member_id ?? null,
    members: [],
    inviteCode: g.invite_code,
    totalContributed: Number(g.total_contributed ?? 0),
    myContribution: Number(g.my_contribution ?? 0),
    paidThisCycle: Number(g.paid_this_cycle ?? 0),
    confirmedThisCycle: Number(g.confirmed_this_cycle ?? 0),
    myPaidThisCycle: Boolean(g.i_paid_this_cycle),
    startDate: g.start_date,
    bankName: g.bank_name ?? null,
    bankAccountNumber: g.bank_account_number ?? null,
    bankAccountName: g.bank_account_name ?? null,
    isAdmin: g.is_admin,
    payoutPosition: g.payout_position,
  };
};

export const apiListGroups = async (): Promise<Group[]> => {
  const { groups } = await apiJson<{ groups: ApiGroupRow[] }>("/groups");
  return groups.map(toGroup);
};

export const apiGetGroup = async (groupId: string): Promise<Group> => {
  const { group } = await apiJson<{ group: ApiGroupRow }>(`/groups/${groupId}`);
  return toGroup(group);
};

export const apiCreateGroup = async (input: {
  name: string;
  amount: number;
  frequency: "Weekly" | "Monthly";
  totalMembers: number;
  startDate?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}) => {
  return apiJson<{ groupId: string; inviteCode: string }>("/groups", { method: "POST", body: JSON.stringify(input) });
};

export const apiJoinGroup = async (inviteCode: string) => {
  return apiJson<{ groupId: string; status: "pending" }>("/groups/join", { method: "POST", body: JSON.stringify({ inviteCode }) });
};

export type JoinRequest = {
  id: string;
  group_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
  full_name: string;
  phone: string;
  email: string;
};

export const apiListJoinRequests = async (groupId: string, status: "pending" | "approved" | "rejected" = "pending") => {
  const qs = `?status=${encodeURIComponent(status)}`;
  return apiJson<{ requests: JoinRequest[] }>(`/groups/${groupId}/join-requests${qs}`);
};

export const apiReviewJoinRequest = async (
  groupId: string,
  requestId: string,
  status: "approved" | "rejected",
) => {
  return apiJson<{ ok: true }>(`/groups/${groupId}/join-requests/${requestId}`, { method: "PATCH", body: JSON.stringify({ status }) });
};

type ApiMemberRow = {
  user_id: string;
  payout_position: number;
  is_admin: boolean;
  joined_at: string;
  full_name: string;
  phone: string;
  paid: boolean;
  contribution_status: "pending" | "confirmed" | "rejected" | null;
  received_payout: boolean;
};

export const apiGetGroupMembers = async (groupId: string): Promise<Member[]> => {
  const { members } = await apiJson<{ members: ApiMemberRow[] }>(`/groups/${groupId}/members`);
  return members.map((m) => ({
    id: m.user_id,
    name: m.full_name,
    phone: m.phone,
    paid: m.paid,
    paymentStatus: m.contribution_status ?? "none",
    receivedPayout: m.received_payout,
    payoutPosition: m.payout_position,
    isAdmin: m.is_admin,
  }));
};

export const apiSubmitContribution = async (input: {
  groupId: string;
  transactionReference: string;
  receiptUrl?: string;
}) => {
  return apiJson<{ contributionId: string }>(`/groups/${input.groupId}/contributions`, {
    method: "POST",
    body: JSON.stringify({ transactionReference: input.transactionReference, receiptUrl: input.receiptUrl }),
  });
};

export type GroupContributionStatus = "pending" | "confirmed" | "rejected";

export type GroupContribution = {
  id: string;
  group_id: string;
  member_id: string;
  cycle_number: number;
  amount: number;
  transaction_reference: string;
  receipt_url: string | null;
  status: GroupContributionStatus;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  member_name: string | null;
};

type ApiGroupContribution = Omit<GroupContribution, "amount"> & { amount: string | number };

export const apiGetGroupContributions = async (groupId: string, cycle?: number) => {
  const qs = cycle ? `?cycle=${encodeURIComponent(String(cycle))}` : "";
  const res = await apiJson<{ contributions: ApiGroupContribution[]; isAdmin: boolean }>(`/groups/${groupId}/contributions${qs}`);
  return {
    isAdmin: res.isAdmin,
    contributions: res.contributions.map((c) => ({ ...c, amount: Number(c.amount) })),
  };
};

export type GroupPayout = {
  id: string;
  group_id: string;
  recipient_id: string;
  recipient_name: string | null;
  cycle_number: number;
  amount: number;
  paid_at: string;
  recorded_by: string;
  notes: string | null;
};

type ApiGroupPayout = Omit<GroupPayout, "amount"> & { amount: string | number };

export const apiGetGroupPayouts = async (groupId: string) => {
  const { payouts } = await apiJson<{ payouts: ApiGroupPayout[] }>(`/groups/${groupId}/payouts`);
  return payouts.map((p) => ({ ...p, amount: Number(p.amount) }));
};

export const apiRecordPayout = async (groupId: string, input?: { recipientId?: string; notes?: string }) => {
  return apiJson<{ payoutId: string; advancedToCycle: number }>(`/groups/${groupId}/payouts`, {
    method: "POST",
    body: JSON.stringify(input ?? {}),
  });
};

type ApiAdminContribution = {
  id: string;
  group_id: string;
  member_id: string;
  cycle_number: number;
  amount: string | number;
  transaction_reference: string;
  receipt_url: string | null;
  status: "pending" | "confirmed" | "rejected";
  submitted_at: string;
  member_name: string | null;
  group_name: string | null;
};

export const apiAdminListContributions = async (status: "pending" | "confirmed" | "rejected") => {
  return apiJson<{ contributions: ApiAdminContribution[] }>(`/admin/contributions?status=${status}`);
};

export const apiAdminReviewContribution = async (id: string, status: "confirmed" | "rejected") => {
  return apiJson<{ ok: true }>(`/admin/contributions/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
};

export const apiUpdateGroupBank = async (
  groupId: string,
  input: { bankName?: string | null; bankAccountNumber?: string | null; bankAccountName?: string | null },
) => {
  return apiJson<{ ok: true }>(`/groups/${groupId}/bank`, { method: "PATCH", body: JSON.stringify(input) });
};

export type ApiNotificationType =
  | "join_request_created"
  | "join_request_approved"
  | "join_request_rejected"
  | "contribution_submitted"
  | "contribution_confirmed"
  | "contribution_rejected"
  | "payout_recorded";

export type AppNotification = {
  id: string;
  type: ApiNotificationType;
  title: string;
  message: string;
  group_id: string | null;
  actor_id: string | null;
  metadata: unknown;
  created_at: string;
  read_at: string | null;
};

export const apiListNotifications = async (input?: { unread?: boolean; limit?: number }) => {
  const qs = new URLSearchParams();
  if (input?.unread) qs.set("unread", "1");
  if (input?.limit) qs.set("limit", String(input.limit));
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiJson<{ notifications: AppNotification[]; unreadCount: number }>(`/notifications${suffix}`);
};

export const apiMarkNotificationRead = async (id: string) => {
  return apiJson<{ ok: true }>(`/notifications/${id}/read`, { method: "PATCH" });
};

export const apiMarkAllNotificationsRead = async () => {
  return apiJson<{ ok: true }>(`/notifications/read-all`, { method: "POST" });
};
=======
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
