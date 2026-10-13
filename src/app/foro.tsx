import { Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Chat, { Msg } from '../components/Chat';
import { PressableScale } from '../components/PressableScale';
import { TopBar } from '../components/ui';
import { useSection } from '../context/section';
import { BODY } from '../theme';

type Room = { title: string; banner?: string; placeholder: string; initial: Msg[] };

const ROOMS: Record<string, Room> = {
  temas: {
    title: 'Diferentes temáticas',
    placeholder: 'Escribe tu mensaje...',
    initial: [
      { id: '1', mine: false, author: 'Valeria', text: '¿Qué hacen para desconectarse cuando están estresadas?' },
      { id: '2', mine: false, author: 'Mar', text: 'Salgo a caminar sin el celular, me ayuda un montón.' },
      { id: '3', mine: true, text: 'Yo pongo música y me preparo un té. ¡Lo recomiendo!' },
      { id: '4', mine: false, author: 'Valeria', text: 'Voy a probar lo del paseo esta semana.' },
    ],
  },
  solo: {
    title: 'Solo mujeres',
    banner: 'Espacio verificado y más privado.',
    placeholder: 'Comparte con confianza...',
    initial: [
      { id: '1', mine: false, author: 'Isa', text: 'Bienvenida. Aquí cuidamos que todas se sientan en confianza.' },
      { id: '2', mine: true, text: 'Gracias. ¿Alguien más tiene ciclos irregulares últimamente?' },
      { id: '3', mine: false, author: 'Isa', text: 'A mí me pasó en época de estrés. Lo platiqué con mi doctora y me tranquilizó.' },
    ],
  },
  pro: {
    title: 'Profesionales',
    banner: 'Respuestas de profesionales verificados. No sustituyen una consulta médica.',
    placeholder: 'Escribe tu pregunta...',
    initial: [
      { id: '1', mine: true, text: 'Mi periodo llegó una semana tarde este mes. ¿Debo preocuparme?' },
      { id: '2', mine: false, author: 'Dra. Ibáñez · Ginecología', text: 'Un retraso ocasional suele estar relacionado con estrés, sueño o cambios de rutina.' },
      { id: '3', mine: false, author: 'Dra. Ibáñez · Ginecología', text: 'Si se repite varios meses o hay dolor intenso, vale la pena agendar una consulta.' },
    ],
  },
};

export default function Foro() {
  const { section, palette: p } = useSection();
  const router = useRouter();
  const { room } = useLocalSearchParams<{ room: string }>();
  const cfg = ROOMS[room ?? 'temas'] ?? ROOMS.temas;
  const title = room === 'solo' && section === 'hombres' ? 'Solo hombres' : cfg.title;

  return (
    <View style={{ flex: 1, backgroundColor: p.cream }}>
      <TopBar
        palette={p}
        title={title}
        left={
          <PressableScale onPress={() => router.back()} hitSlop={10}>
            <Icon name="arrow-left" size={26} color={p.ink} />
          </PressableScale>
        }
        right={<Icon name="dots-horizontal" size={26} color={p.ink} />}
      />
      {!!cfg.banner && (
        <View style={{ backgroundColor: p.soft, paddingHorizontal: 18, paddingVertical: 8 }}>
          <Text style={{ fontFamily: BODY, fontSize: 11, color: p.ink, textAlign: 'center' }}>{cfg.banner}</Text>
        </View>
      )}
      <Chat key={room} palette={p} initial={cfg.initial} placeholder={cfg.placeholder} myAvatar safeBottom />
    </View>
  );
}