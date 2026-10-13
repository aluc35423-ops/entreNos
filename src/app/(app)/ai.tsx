import { View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useSection } from '../../context/section';
import Chat, { Msg } from '../../components/Chat';
import { Avatar, TopBar } from '../../components/ui';

const INITIAL: Msg[] = [
  { id: '1', mine: true, text: 'Hola, tengo un retraso de una semana, ¿es normal?' },
  { id: '2', mine: false, text: 'Puede ser: el estrés, el sueño o cambios de rutina lo explican seguido.' },
  { id: '3', mine: true, text: 'Llevo unas semanas bajo estrés, la verdad.' },
  { id: '4', mine: false, text: 'Eso explica bastante. Si pasa de 2 o 3 meses seguidos, sí vale la pena ver a un médico.' },
  { id: '5', mine: false, text: '¿Quieres que te deje un recordatorio para revisarlo en unas semanas?' },
];

export default function AI() {
  const { palette: p } = useSection();
  return (
    <View style={{ flex: 1, backgroundColor: p.cream }}>
      <TopBar
        palette={p}
        title="BOT-ASISTENTE DE SALUD"
        left={<Avatar size={34} />}
        right={<Icon name="dots-horizontal" size={26} color={p.ink} />}
      />
      <Chat
        palette={p}
        initial={INITIAL}
        placeholder="Escribe tu mensaje..."
        quickReplies={['Sí, recuérdamelo', 'No, gracias']}
      />
    </View>
  );
}