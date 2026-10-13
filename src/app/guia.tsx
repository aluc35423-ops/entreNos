import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import SubScreen from '../components/SubScreen';
import IconBadge from '../components/IconBadge';
import { Card, CardTitle, PrimaryButton } from '../components/form';
import { PressableScale } from '../components/PressableScale';
import { WEEKLY_GUIDE as G } from '../data/guides';
import { BODY, BODY_BOLD, FONT, PALETTES } from '../theme';

const p = PALETTES.parejas;

export default function Guia() {
  const [checked, setChecked] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const toggle = (i: number) =>
    setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  return (
    <SubScreen
      title="Sugerencia de la semana"
      palette={p}
      footer={
        <PrimaryButton
          p={p}
          label={done ? '¡Hecha! Gracias por intentarlo' : 'Marcar como hecha'}
          onPress={() => setDone((d) => !d)}
        />
      }
    >
      <View style={[styles.hero, { backgroundColor: p.primary }]}>
        <IconBadge name={G.icon} size={88} bg={p.cream} color={p.ink} round />
        <Text style={[styles.title, { color: p.ink }]}>{G.title}</Text>
        <View style={styles.tags}>
          <Text style={[styles.tag, { color: p.ink, backgroundColor: p.highlight }]}>{`Nivel: ${G.level}`}</Text>
          <Text style={[styles.tag, { color: p.ink, backgroundColor: p.cream }]}>{`${G.minutes} min`}</Text>
        </View>
      </View>

      <Card p={p}>
        <CardTitle p={p}>Antes de empezar</CardTitle>
        {G.before.map((t, i) => {
          const on = checked.includes(i);
          return (
            <PressableScale key={t} onPress={() => toggle(i)} scaleTo={0.98} style={styles.check}>
              <Icon name={on ? 'check-circle' : 'circle-outline'} size={24} color={p.ink} />
              <Text style={[styles.text, { color: p.ink, opacity: on ? 0.55 : 1 }]}>{t}</Text>
            </PressableScale>
          );
        })}
      </Card>

      <Card p={p}>
        <CardTitle p={p}>Paso a paso</CardTitle>
        {G.steps.map((s, i) => (
          <View key={s.title} style={[styles.step, { backgroundColor: p.cream }]}>
            <View style={[styles.num, { backgroundColor: p.button }]}>
              <Text style={[styles.numText, { color: p.ink }]}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.stepTitle, { color: p.ink }]}>{s.title}</Text>
              <Text style={[styles.text, { color: p.ink }]}>{s.text}</Text>
            </View>
          </View>
        ))}
      </Card>

      <View style={[styles.tips, { backgroundColor: p.cream }]}>
        <Text style={[styles.stepTitle, { color: p.ink }]}>Para tener en cuenta</Text>
        {G.tips.map((t) => (
          <Text key={t} style={[styles.text, { color: p.ink }]}>{`• ${t}`}</Text>
        ))}
      </View>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 22, padding: 20, alignItems: 'center', gap: 10 },
  title: { fontFamily: FONT, fontSize: 22, textAlign: 'center' },
  tags: { flexDirection: 'row', gap: 8 },
  tag: {
    fontFamily: BODY_BOLD,
    fontSize: 12,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  check: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  text: { flexShrink: 1, fontFamily: BODY, fontSize: 13, lineHeight: 19 },
  step: { flexDirection: 'row', gap: 12, borderRadius: 14, padding: 12, alignItems: 'flex-start' },
  num: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: FONT, fontSize: 14 },
  stepTitle: { fontFamily: BODY_BOLD, fontSize: 13, marginBottom: 2 },
  tips: { borderRadius: 16, padding: 16, gap: 6 },
});