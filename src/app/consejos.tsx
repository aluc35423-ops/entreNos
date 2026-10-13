import { Pressable, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSection } from '../context/section';
import Chat, { Msg } from '../components/Chat';
import { TopBar } from '../components/ui';

const INITIAL: Msg[] = [
  { id: '1', mine: true, text: 'Chicas, pregunta random: ¿alguien más siente que el sexo duele un poco al inicio aunque haya lubricación?' },
  { id: '2', mine: false, text: 'Sí, me pasaba seguido. Terminé yendo con ginecóloga y era algo leve, nada grave.' },
  { id: '3', mine: true, text: 'Uy ok, ¿y cómo se trata?' },
  { id: '4', mine: false, text: 'Ejercicios de relajación y dilatadores, en mi caso. Mejoró bastante en un par de meses.' },
  { id: '5', mine: false, text: 'Si el dolor persiste más de unas semanas, vale la pena una consulta: no siempre es psicológico.' },
];

export default function Consejos() {
  const { palette: p } = useSection();
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: p.cream }}>
      <TopBar
        palette={p}
        title="Consejos sexuales"
        left={
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Icon name="arrow-left" size={26} color={p.ink} />
          </Pressable>
        }
        right={<Icon name="dots-horizontal" size={26} color={p.ink} />}
      />
      <Chat palette={p} initial={INITIAL} placeholder="Escribe tu mensaje..." myAvatar safeBottom />
    </View>
  );
}