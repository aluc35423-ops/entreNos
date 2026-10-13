import { createContext, ReactNode, useContext, useState } from 'react';
import { PALETTES, Palette, Section } from '../theme';

type Ctx = { section: Section; setSection: (s: Section) => void; palette: Palette };

const SectionContext = createContext<Ctx>({
  section: 'mujeres',
  setSection: () => {},
  palette: PALETTES.mujeres,
});

export function SectionProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<Section>('mujeres'); // cambia a 'hombres' para probar
  return (
    <SectionContext.Provider value={{ section, setSection, palette: PALETTES[section] }}>
      {children}
    </SectionContext.Provider>
  );
}

export const useSection = () => useContext(SectionContext);