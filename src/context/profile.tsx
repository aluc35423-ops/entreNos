import { createContext, ReactNode, useContext, useState } from 'react';

export type Profile = {
  name: string;
  email: string;
  // Perfil en foros
  alias: string;
  avatar: string; // nombre de un ícono de MaterialCommunityIcons
  bio: string;
  showAlias: boolean;
  approveFollowers: boolean;
  allowDMs: boolean;
  showSection: boolean;
  // Datos de salud
  height: string;
  weight: string;
  age: string;
  exercise: boolean | null;
  cycleLength: string;
  periodLength: string;
};

const DEFAULT: Profile = {
  name: 'Camila Torres', // ejemplo: se reemplaza con el registro
  email: '',
  alias: '',
  avatar: 'flower-outline',
  bio: '',
  showAlias: true,
  approveFollowers: false,
  allowDMs: true,
  showSection: true,
  height: '',
  weight: '',
  age: '',
  exercise: null,
  cycleLength: '28',
  periodLength: '5',
};

type Ctx = { profile: Profile; update: (patch: Partial<Profile>) => void };

const ProfileContext = createContext<Ctx>({ profile: DEFAULT, update: () => {} });

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT);
  const update = (patch: Partial<Profile>) => setProfile((p) => ({ ...p, ...patch }));
  return <ProfileContext.Provider value={{ profile, update }}>{children}</ProfileContext.Provider>;
}

export const useProfile = () => useContext(ProfileContext);