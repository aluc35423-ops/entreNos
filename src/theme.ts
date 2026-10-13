export const FONT = 'Fredoka_600SemiBold';      // títulos y botones
export const LOGO_FONT = 'TitanOne_400Regular'; // letras del logo
export const BODY = 'Quicksand_500Medium';      // texto normal
export const BODY_BOLD = 'Quicksand_700Bold';   // texto en negrita

// Colores del splash y el login
export const COLORS = {
  gradient: ['#B7A3F2', '#F4B6CF', '#FFD9B8'] as const, // lila → rosa → durazno
  text: '#4A3A8A',
  primary: '#6E5BB0',
  yellow: '#FFD54F',
  teal: '#4DD0C4',
  pink: '#FF6F91',
  lilac: '#C9B8F5',
  shadow: '#6E5BB0',
};

// Paletas por sección de la app
export type Section = 'mujeres' | 'hombres' | 'parejas';

export type Palette = {
  primary: string;
  soft: string;
  cream: string;
  button: string;
  highlight: string;
  accent: string;
  ink: string;
};

const SHARED = { cream: '#fff6e4', button: '#ffcffb', highlight: '#ffbdf9' };

export const PALETTES: Record<Section, Palette> = {
  mujeres: { ...SHARED, primary: '#acfae4', soft: '#d5fff4', accent: '#3AA58C', ink: '#1F4D43' },
  hombres: { ...SHARED, primary: '#ffd06f', soft: '#ffe8b9', accent: '#E8962A', ink: '#5A3A00' },
  parejas: { ...SHARED, primary: '#dac3f7', soft: '#f0e4ff', accent: '#6B4FA3', ink: '#3B2A66' },
};