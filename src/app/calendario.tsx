import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PressableScale as Pressable } from '../components/PressableScale';
import { useSection } from '../context/section';
import { useLog } from '../context/log';
import { MONTHS } from '../utils/dates';
import { BODY, BODY_BOLD } from '../theme';
import { shadow, TopBar } from '../components/ui';

type Kind = 'period' | 'fertile' | 'ovulation' | 'today' | 'prediction' | 'none';

// Datos de ejemplo
const PERIOD = [1, 2, 3, 4, 5];
const FERTILE = [13, 14, 16, 17];
const OVULATION = 15;

export default function Calendario() {
  const { palette: p } = useSection();
  const router = useRouter();
  const { get } = useLog();
  const log = get();
  const logged = [...log.symptoms, ...log.sex];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const lead = (new Date(year, month, 1).getDay() + 6) % 7; // la semana empieza en lunes
  const total = new Date(year, month + 1, 0).getDate();

  const cells: { day: number; kind: Kind }[] = [];
  for (let i = 0; i < lead; i++) cells.push({ day: 0, kind: 'none' });
  for (let d = 1; d <= total; d++) {
    let kind: Kind = 'none';
    if (PERIOD.includes(d)) kind = 'period';
    else if (d === OVULATION) kind = 'ovulation';
    else if (FERTILE.includes(d)) kind = 'fertile';
    if (d === today.getDate()) kind = 'today';
    cells.push({ day: d, kind });
  }
  let next = 1;
  while (cells.length % 7 !== 0) cells.push({ day: next++, kind: 'prediction' });

  const circle = (kind: Kind) => {
    switch (kind) {
      case 'period': return { backgroundColor: p.accent };
      case 'today': return { backgroundColor: p.ink };
      case 'fertile': return { backgroundColor: p.primary };
      case 'ovulation': return { borderWidth: 2, borderColor: p.ink };
      case 'prediction': return { backgroundColor: '#EBE5D8' };
      default: return {};
    }
  };
  const light = (k: Kind) => k === 'period' || k === 'today';

  const legend: { label: string; style: object }[] = [
    { label: 'Periodo', style: { backgroundColor: p.accent } },
    { label: 'Fértil', style: { backgroundColor: p.primary } },
    { label: 'Ovulación', style: { borderWidth: 2, borderColor: p.ink } },
    { label: 'Predicción', style: { backgroundColor: '#EBE5D8' } },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: p.cream }}>
      <TopBar
        palette={p}
        title={MONTHS[month].toUpperCase()}
        left={
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Icon name="arrow-left" size={26} color={p.ink} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.legend}>
          {legend.map((l) => (
            <View key={l.label} style={styles.legendItem}>
              <View style={[styles.dot, l.style]} />
              <Text style={[styles.legendText, { color: p.ink }]}>{l.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.week}>
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <Text key={i} style={[styles.weekDay, { color: p.ink }]}>{d}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((c, i) => (
            <View key={i} style={styles.cell}>
              {c.day > 0 && (
                <View style={[styles.circle, circle(c.kind)]}>
                  <Text
                    style={[
                      styles.dayText,
                      { color: light(c.kind) ? '#FFFFFF' : p.ink },
                      c.kind === 'prediction' && { color: '#8A8478' },
                    ]}
                  >
                    {c.day}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={[styles.card, shadow(p.ink)]}>
          <Text style={[styles.cardTitle, { color: p.ink }]}>
            {`${today.getDate()} de ${MONTHS[month]} · Hoy`}
          </Text>
          <Text style={[styles.cardText, { color: p.ink }]}>Fase folicular · Día 3 post-periodo</Text>

          {logged.length > 0 && (
            <View style={styles.tags}>
              {logged.map((t) => (
                <View key={t} style={[styles.tag, { backgroundColor: p.soft }]}>
                  <Text style={[styles.tagText, { color: p.ink }]}>{t}</Text>
                </View>
              ))}
            </View>
          )}

          {log.notes.map((n, i) => (
            <Text key={i} style={[styles.noteText, { color: p.ink }]}>{`• ${n}`}</Text>
          ))}

          <View style={styles.cardActions}>
            <Pressable style={[styles.pill, { backgroundColor: p.button }]} onPress={() => router.push('/sintomas')}>
              <Text style={[styles.pillText, { color: p.ink }]}>+ Síntoma</Text>
            </Pressable>
            <Pressable style={[styles.pill, { backgroundColor: p.button }]} onPress={() => router.push('/nota')}>
              <Text style={[styles.pillText, { color: p.ink }]}>+ Nota</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18 },
  legend: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontFamily: BODY_BOLD, fontSize: 11 },
  week: { flexDirection: 'row', marginBottom: 6 },
  weekDay: { width: '14.2857%', textAlign: 'center', fontFamily: BODY_BOLD, fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.2857%', height: 46, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontFamily: BODY_BOLD, fontSize: 13 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginTop: 20 },
  cardTitle: { fontFamily: BODY_BOLD, fontSize: 14 },
  cardText: { fontFamily: BODY, fontSize: 13, marginTop: 4 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontFamily: BODY_BOLD, fontSize: 11 },
  noteText: { fontFamily: BODY, fontSize: 12, marginTop: 8, lineHeight: 17 },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  pill: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8 },
  pillText: { fontFamily: BODY_BOLD, fontSize: 12 },
});