import { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import SubScreen from '../components/SubScreen';
import { Card, CardTitle, PrimaryButton } from '../components/form';
import { PressableScale } from '../components/PressableScale';
import { shadow } from '../components/ui';
import { useSection } from '../context/section';
import { BODY, BODY_BOLD } from '../theme';

const SUPPORT_EMAIL = 'soporte@tudominio.com'; // TODO: correo real del cliente

const FAQ = [
  {
    q: '¿Cómo registro mi periodo?',
    a: 'Desde Inicio toca "Editar periodo" o el selector de días para abrir el calendario y marcar tus días.',
  },
  {
    q: '¿Cómo registro síntomas o notas?',
    a: 'En Inicio toca "Síntomas", o abre el calendario y usa los botones "+ Síntoma" y "+ Nota" del día de hoy.',
  },
  {
    q: '¿Cómo cambio mi alias en los foros?',
    a: 'Ve a Ajustes → Perfil en foros. Ahí puedes cambiar tu alias, avatar y qué información se muestra.',
  },
  {
    q: '¿Cómo activo el bloqueo con huella o Face ID?',
    a: 'En Ajustes → Privacidad encuentras el interruptor de bloqueo con huella / Face ID.',
  },
];

export default function Ayuda() {
  const { palette: p } = useSection();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <SubScreen title="Ayuda y soporte">
      <Card p={p}>
        <CardTitle p={p}>Preguntas frecuentes</CardTitle>
        {FAQ.map((f, i) => {
          const isOpen = open === i;
          return (
            <Animated.View key={f.q} layout={LinearTransition.duration(250)} style={[styles.faq, { backgroundColor: p.soft }]}>
              <PressableScale onPress={() => setOpen(isOpen ? null : i)} scaleTo={0.98} style={styles.faqHead}>
                <Text style={[styles.q, { color: p.ink }]}>{f.q}</Text>
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={22} color={p.ink} />
              </PressableScale>
              {isOpen && (
                <Animated.Text entering={FadeIn.duration(250)} style={[styles.a, { color: p.ink }]}>
                  {f.a}
                </Animated.Text>
              )}
            </Animated.View>
          );
        })}
      </Card>

      <Card p={p}>
        <CardTitle p={p}>¿Necesitas más ayuda?</CardTitle>
        <Text style={[styles.a, { color: p.ink }]}>Escríbenos y te respondemos lo antes posible.</Text>
        <PrimaryButton
          p={p}
          label="Escribir a soporte"
          onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Ayuda con Entre Nos')}`)}
        />
      </Card>

      <View style={[styles.emergency, { backgroundColor: p.primary }, shadow(p.ink)]}>
        <Icon name="alert-circle-outline" size={24} color={p.ink} />
        <Text style={[styles.a, { color: p.ink, flex: 1 }]}>
          Esta app no sustituye la atención médica. Si es una emergencia, llama al 911.
        </Text>
      </View>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  faq: { borderRadius: 14, overflow: 'hidden' },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  q: { flex: 1, fontFamily: BODY_BOLD, fontSize: 13 },
  a: { fontFamily: BODY, fontSize: 12, lineHeight: 18, paddingHorizontal: 14, paddingBottom: 14 },
  emergency: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 14 },
});