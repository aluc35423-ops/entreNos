import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import IconBadge from '../components/IconBadge';
import { PressableScale } from '../components/PressableScale';
import { shadow } from '../components/ui';
import { useSection } from '../context/section';
import { useLog } from '../context/log';
import { BODY, BODY_BOLD, FONT } from '../theme';

const QUESTIONS: { tag: string; icon: keyof typeof Icon.glyphMap; text: string }[] = [
  { tag: 'Actividad', icon: 'walk', text: '¿Saliste a caminar o te moviste hoy?' },
  { tag: 'Hidratación', icon: 'water-outline', text: '¿Tomaste suficiente agua hoy?' },
  { tag: 'Sueño', icon: 'sleep', text: '¿Dormiste al menos 7 horas anoche?' },
  { tag: 'Alimentación', icon: 'food-apple-outline', text: '¿Comiste frutas o verduras hoy?' },
  { tag: 'Bienestar', icon: 'meditation', text: '¿Te diste un momento para ti hoy?' },
];

export default function CheckIn() {
  const { palette: p } = useSection();
  const { update } = useLog();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const done = i >= QUESTIONS.length;
  const yes = Object.values(answers).filter(Boolean).length;

  const answer = (v: boolean) => {
    const next = { ...answers, [QUESTIONS[i].tag]: v };
    setAnswers(next);
    if (i === QUESTIONS.length - 1) update({ checkin: next });
    setI(i + 1);
  };

  return (
    <LinearGradient
      colors={[p.cream, p.soft]}
      style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }]}
    >
      <View style={styles.top}>
        <PressableScale onPress={() => router.back()} hitSlop={10}>
          <Icon name="close" size={28} color={p.ink} />
        </PressableScale>
        <View style={styles.progress}>
          {QUESTIONS.map((_, idx) => (
            <View
              key={idx}
              style={[styles.seg, { backgroundColor: idx < i ? p.highlight : 'rgba(0,0,0,0.12)' }]}
            />
          ))}
        </View>
      </View>

      <View style={styles.cardArea}>
        {!done ? (
          <Animated.View
            key={i}
            entering={FadeInRight.duration(380)}
            exiting={FadeOutLeft.duration(260)}
            style={[styles.card, { backgroundColor: p.primary }, shadow(p.ink)]}
          >
            <View style={[styles.tag, { backgroundColor: p.cream }]}>
              <Text style={[styles.tagText, { color: p.ink }]}>{QUESTIONS[i].tag}</Text>
            </View>
            <IconBadge name={QUESTIONS[i].icon} size={140} bg={p.cream} color={p.ink} round />
            <Text style={[styles.question, { color: p.ink }]}>{QUESTIONS[i].text}</Text>
          </Animated.View>
        ) : (
          <Animated.View
            key="done"
            entering={FadeInRight.duration(380)}
            style={[styles.card, { backgroundColor: p.primary }, shadow(p.ink)]}
          >
            <IconBadge name="check-decagram" size={140} bg={p.cream} color={p.ink} round />
            <Text style={[styles.question, { color: p.ink }]}>¡Listo por hoy!</Text>
            <Text style={[styles.summary, { color: p.ink }]}>
              {`Respondiste que sí a ${yes} de ${QUESTIONS.length} hábitos. Cada día cuenta.`}
            </Text>
          </Animated.View>
        )}
      </View>

      {!done ? (
        <View style={styles.buttons}>
          <PressableScale
            style={[styles.answer, { backgroundColor: p.cream }, shadow(p.ink)]}
            onPress={() => answer(false)}
          >
            <Icon name="close" size={22} color={p.ink} />
            <Text style={[styles.answerText, { color: p.ink }]}>No</Text>
          </PressableScale>
          <PressableScale
            style={[styles.answer, { backgroundColor: p.button }, shadow(p.ink)]}
            onPress={() => answer(true)}
          >
            <Icon name="check" size={22} color={p.ink} />
            <Text style={[styles.answerText, { color: p.ink }]}>Sí</Text>
          </PressableScale>
        </View>
      ) : (
        <PressableScale style={[styles.close, { backgroundColor: p.button }]} onPress={() => router.back()}>
          <Text style={[styles.answerText, { color: p.ink }]}>Cerrar</Text>
        </PressableScale>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  progress: { flex: 1, flexDirection: 'row', gap: 6 },
  seg: { flex: 1, height: 5, borderRadius: 3 },
  cardArea: { flex: 1, marginVertical: 24 },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  tag: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6 },
  tagText: { fontFamily: BODY_BOLD, fontSize: 12 },
  question: { fontFamily: FONT, fontSize: 24, textAlign: 'center', lineHeight: 30 },
  summary: { fontFamily: BODY, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  buttons: { flexDirection: 'row', gap: 16 },
  answer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 28,
  },
  answerText: { fontFamily: FONT, fontSize: 16 },
  close: { height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});