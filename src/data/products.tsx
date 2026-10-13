import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import type { Section } from '../theme';

export type Product = {
  id: string;
  name: string;
  price: string;
  category: 'Protección' | 'Menstruación' | 'Bienestar' | 'Parejas';
  icon: keyof typeof Icon.glyphMap;
  description: string;
  only?: Section;
};

// Productos de ejemplo: reemplázalos por el catálogo real del cliente
export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Lubricante base agua', price: '$109', category: 'Protección', icon: 'bottle-tonic-outline', description: 'Fórmula suave y compatible con preservativos de látex.' },
  { id: 'p2', name: 'Preservativos x18', price: '$99', category: 'Protección', icon: 'shield-check-outline', description: 'Caja con 18 piezas de látex, lubricados.' },
  { id: 'p3', name: 'Copa menstrual', price: '$249', category: 'Menstruación', icon: 'cup-water', description: 'Reutilizable de silicón de grado médico, con estuche.', only: 'mujeres' },
  { id: 'p4', name: 'Toallas de tela', price: '$189', category: 'Menstruación', icon: 'hanger', description: 'Set de 3 toallas lavables y reutilizables.', only: 'mujeres' },
  { id: 'p5', name: 'Bolsa térmica', price: '$139', category: 'Bienestar', icon: 'heat-wave', description: 'Calor suave para relajar la zona abdominal o la espalda.' },
  { id: 'p6', name: 'Té de manzanilla', price: '$65', category: 'Bienestar', icon: 'tea-outline', description: 'Caja con 20 sobres para tus momentos de calma.' },
  { id: 'p7', name: 'Aceite de masaje', price: '$159', category: 'Parejas', icon: 'flower-outline', description: 'Aceite aromático para masajes en pareja.' },
  { id: 'p8', name: 'Juego de cartas', price: '$129', category: 'Parejas', icon: 'cards-playing-outline', description: 'Preguntas y retos para conocerse mejor.' },
];