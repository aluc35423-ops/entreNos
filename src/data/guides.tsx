import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const WEEKLY_GUIDE = {
  icon: 'hand-heart-outline' as keyof typeof Icon.glyphMap,
  title: 'Masaje de espalda en pareja',
  level: 'Principiante',
  minutes: 20,
  before: [
    'Platiquen qué les gustaría y qué no',
    'Elijan un momento sin prisas ni pantallas',
    'Preparen aceite o crema y una toalla',
    'Acuerden una palabra o gesto para pausar',
  ],
  steps: [
    { title: 'Preparen el ambiente', text: 'Luz tenue, música suave y una temperatura agradable.' },
    { title: 'Empiecen despacio', text: 'Palmas abiertas, movimientos largos y presión ligera. Pregunta cómo se siente.' },
    { title: 'Ajusten la presión', text: 'Aumenten o reduzcan según lo que la otra persona pida.' },
    { title: 'Cambien de turno', text: 'Intercambien lugares para que ambos reciban y den.' },
    { title: 'Cierren con calma', text: 'Un abrazo y unos minutos para hablar de cómo se sintieron.' },
  ],
  tips: [
    'La comunicación es parte de la actividad: hablen durante todo el proceso.',
    'No hay meta ni prisa: se trata de conectar.',
  ],
};