import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "customer" | "staff" | "driver" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
  address?: string;
  title?: string; // e.g. Pharmacist, Operations Officer
  avatar?: string;
}

interface Credential extends AuthUser {
  password: string;
}

// Seeded demo accounts — all use Demo123 unless noted
export const DEMO_ACCOUNTS: Credential[] = [
  // Customers — chipo@gmail.com is the primary demo customer (per spec)
  { id: "c0", email: "chipo@gmail.com", password: "demo1234", firstName: "Chipo", lastName: "Mhuri", role: "customer", phone: "+263 77 000 0001", address: "10 Sam Nujoma St, Harare", avatar: "CM" },
  { id: "c1", email: "tendai@kingspharmacy.demo", password: "Demo123", firstName: "Tendai", lastName: "Moyo", role: "customer", phone: "+263 77 123 4567", address: "12 Samora Machel Ave, Harare", avatar: "TM" },
  { id: "c2", email: "nyasha@kingspharmacy.demo", password: "Demo123", firstName: "Nyasha", lastName: "Dube", role: "customer", phone: "+263 77 234 5678", address: "45 Borrowdale Rd, Harare", avatar: "ND" },
  { id: "c3", email: "blessing@kingspharmacy.demo", password: "Demo123", firstName: "Blessing", lastName: "Ncube", role: "customer", phone: "+263 71 345 6789", address: "8 Avondale Shopping Centre, Harare", avatar: "BN" },
  { id: "c4", email: "rutendo@kingspharmacy.demo", password: "Demo123", firstName: "Rutendo", lastName: "Chikore", role: "customer", phone: "+263 77 456 7890", address: "22 Newlands, Harare", avatar: "RC" },

  // Staff
  { id: "s1", email: "pharmacist@kingspharmacy.demo", password: "Demo123", firstName: "Dr. Tatenda", lastName: "Mukamuri", role: "staff", title: "Senior Pharmacist", avatar: "TM" },
  { id: "s2", email: "operations@kingspharmacy.demo", password: "Demo123", firstName: "Chipo", lastName: "Madziva", role: "staff", title: "Operations Officer", avatar: "CM" },
  { id: "s3", email: "inventory@kingspharmacy.demo", password: "Demo123", firstName: "Farai", lastName: "Mhlanga", role: "staff", title: "Inventory Manager", avatar: "FM" },

  // Drivers
  { id: "d1", email: "michael.driver@kingspharmacy.demo", password: "Demo123", firstName: "Michael", lastName: "Sibanda", role: "driver", phone: "+263 77 555 0001", avatar: "MS" },
  { id: "d2", email: "sarah.driver@kingspharmacy.demo", password: "Demo123", firstName: "Sarah", lastName: "Ndlovu", role: "driver", phone: "+263 77 555 0002", avatar: "SN" },
  { id: "d3", email: "peter.driver@kingspharmacy.demo", password: "Demo123", firstName: "Peter", lastName: "Chikumba", role: "driver", phone: "+263 77 555 0003", avatar: "PC" },

  // Admin
  { id: "a1", email: "admin@kingspharmacy.demo", password: "Demo123", firstName: "Admin", lastName: "Kings", role: "admin", title: "Administrator", avatar: "AK" },
];

export const ROLE_HOME: Record<Role, string> = {
  customer: "/account",
  staff: "/staff",
  driver: "/driver",
  admin: "/admin",
};

interface AuthState {
  user: AuthUser | null;
  users: Credential[]; // includes registered customers
  login: (email: string, password: string, role?: Role) => { ok: true; user: AuthUser } | { ok: false; error: string };
  register: (input: { firstName: string; lastName: string; email: string; password: string; phone: string; address: string }) => { ok: true; user: AuthUser } | { ok: false; error: string };
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: DEMO_ACCOUNTS,
      login: (email, password, role) => {
        const e = email.trim().toLowerCase();
        const match = get().users.find((u) => u.email.toLowerCase() === e && u.password === password);
        if (!match) return { ok: false, error: "Invalid email or password." };
        if (role && match.role !== role) return { ok: false, error: `This account isn't a ${role} account.` };
        const { password: _, ...user } = match;
        set({ user });
        return { ok: true, user };
      },
      register: ({ firstName, lastName, email, password, phone, address }) => {
        const e = email.trim().toLowerCase();
        if (get().users.some((u) => u.email.toLowerCase() === e)) {
          return { ok: false, error: "An account with this email already exists." };
        }
        const cred: Credential = {
          id: `c${Date.now()}`,
          email: e,
          password,
          firstName,
          lastName,
          phone,
          address,
          role: "customer",
          avatar: (firstName[0] + lastName[0]).toUpperCase(),
        };
        const { password: _, ...user } = cred;
        set({ users: [...get().users, cred], user });
        return { ok: true, user };
      },
      logout: () => set({ user: null }),
    }),
    { name: "kp-auth" },
  ),
);
