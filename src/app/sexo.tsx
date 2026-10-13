import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Sheet from '../components/Sheet';
import { Card, CardTitle, Chip } from '../components/form';
import { useSection } from '../context/section';
import { useLog } from '../context/log';
import { MONTHS } from '../utils/dates';
import { BODY } from '../theme';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type Group = { title: string; single?: boolean; items: { label: string; icon: keyof typeof Icon.glyphMap }[] };

const NONE = 'Sin relaciones';
const UNPROTECTED = 'Sin protección';

const GROUPS: Group[] = [
  {
    title: 'Actividad',
    items: [
      { label: NONE, icon: 'cancel' },
      { label: 'Con protección', icon: 'shield-check-outline' },
      { label: UNPROTECTED, icon: 'alert-outline' },
      { label: 'Sexo oral', icon: 'emoticon-kiss-outline' },
      { label: 'Sexo anal', icon: 'heart-circle-outline' },
      { label: 'Masturbación', icon: 'hand-back-right-outline' },
      { label: 'Caricias', icon: 'hand-heart-outline' },
      { label: 'Juguetes', icon: 'gift-outline' },
    ],
  },
  {
    title: 'Orgasmo',
    single: true,
    items: [
      { label: 'Orgasmo', icon: 'creation' },
      { label: 'Sin orgasmo', icon: 'weather-fog' },
    ],
  },
  {
    title: 'Deseo',
    single: true,
    items: [
      { label: 'Deseo alto', icon: 'fire' },
      { label: 'Deseo neutro', icon: 'emoticon-neutral-outline' },
      { label: 'Deseo bajo', icon: 'snowflake' },
    ],
  },
];

export default function Sexo() {
  const { palette: p } = useSection();
  const { get, update } = useLog();
  const [selected, setSelected] = useState<string[]>(get().sex);
  const today = new Date();

  const toggle = (group: Group, label: string) =>
    setSelected((s) => {
      if (s.includes(label)) return s.filter((x) => x !== label);
      const names = group.items.map((i) => i.label);
      let next = group.single ? s.filter((x) => !names.includes(x)) : s;
      if (label === NONE) next = next.filter((x) => !names.includes(x));
      else next = next.filter((x) => x !== NONE);
      return [...next, label];
    });

  return (
    <Sheet
      title="Hoy"
      subtitle={`${today.getDate()} de ${MONTHS[today.getMonth()]} · Vida sexual`}
      onSave={() => update({ sex: selected })}
    >
      {GROUPS.map((g) => (
        <Card key={g.title} p={p}>
          <CardTitle p={p}>{g.title}</CardTitle>
          <View style={styles.wrap}>
            {g.items.map((i) => (
              <Chip
                key={i.label}
                p={p}
                label={i.label}
                emoji={i.emoji}
                selected={selected.includes(i.label)}
                onPress={() => toggle(g, i.label)}
              />
            ))}
          </View>
        </Card>
      ))}

      {selected.includes(UNPROTECTED) && (
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(150)} style={[styles.tip, { backgroundColor: p.primary }]}>
          <Text style={[styles.tipText, { color: p.ink }]}>
            Tip: si hubo sexo sin protección, considera hacerte pruebas de ITS y consulta a un profesional de la salud si tienes dudas.
          </Text>
        </Animated.View>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tip: { borderRadius: 16, padding: 14 },
  tipText: { fontFamily: BODY, fontSize: 12, lineHeight: 17 },
});