// Mock data layer for the Ajo app

export interface Member {
  id: string;
  name: string;
  phone: string;
  paid: boolean;
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
  members: Member[];
  inviteCode: string;
  totalContributed: number;
  myContribution: number;
  paidThisCycle: number;
  startDate: string;
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
