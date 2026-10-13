import { createContext, ReactNode, useContext, useState } from 'react';

export type DayLog = {
  symptoms: string[];
  sex: string[];
  notes: string[];
  checkin: Record<string, boolean>;
};

const EMPTY: DayLog = { symptoms: [], sex: [], notes: [], checkin: {} };

export const dayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

type Ctx = {
  get: (key?: string) => DayLog;
  update: (patch: Partial<DayLog>, key?: string) => void;
};

const LogContext = createContext<Ctx>({ get: () => EMPTY, update: () => {} });

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<Record<string, DayLog>>({});

  const get = (key = dayKey()) => logs[key] ?? EMPTY;
  const update = (patch: Partial<DayLog>, key = dayKey()) =>
    setLogs((all) => ({ ...all, [key]: { ...(all[key] ?? EMPTY), ...patch } }));

  return <LogContext.Provider value={{ get, update }}>{children}</LogContext.Provider>;
}

export const useLog = () => useContext(LogContext);