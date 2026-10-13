import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import SubScreen from '../components/SubScreen';
import IconBadge from '../components/IconBadge';
import { Card, CardTitle, PrimaryButton } from '../components/form';
import { PressableScale } from '../components/PressableScale';
import { shadow } from '../components/ui';
import { BODY, BODY_BOLD, FONT, PALETTES } from '../theme';

const p = PALETTES.parejas;

type IconName = keyof typeof Icon.glyphMap;
type Challenge = { id: string; icon: IconName; text: string };

const DEFAULTS: Challenge[] = [
  { id: '1', icon: 'hand-heart-outline', text: 'Masaje de espalda de 5 minutos' },
  { id: '2', icon: 'music', text: 'Bailen una canción lenta' },
  { id: '3', icon: 'thought-bubble-outline', text: 'Cuéntale tu mejor recuerdo juntos' },
  { id: '4', icon: 'silverware-fork-knife', text: 'Preparen algo rico para cenar' },
  { id: '5', icon: 'emoticon-kiss-outline', text: 'Besos por un minuto, sin hablar' },
  { id: '6', icon: 'note-text-outline', text: 'Escribe una nota de cariño' },
  { id: '7', icon: 'account-heart-outline', text: 'Un abrazo de 30 segundos' },
  { id: '8', icon: 'calendar-heart', text: 'Elijan una cita para este mes' },
];

const W = 290;
const C = W / 2;
const R = 140;
const SPIN_MS = 4200;
const MAX = 12;
const MIN = 3;

// Ángulos medidos en sentido horario desde arriba
const point = (a: number, r: number) => ({ x: C + r * Math.sin(a), y: C - r * Math.cos(a) });

const colorFor = (i: number, n: number) => {
  const colors = [p.primary, p.soft, p.button, p.highlight];
  const idx = i === n - 1 && i % 4 === 0 ? 2 : i % 4;
  return colors[idx];
};

function Wheel({ items }: { items: Challenge[] }) {
  const seg = (2 * Math.PI) / items.length;
  return (
    <View style={{ width: W, height: W }}>
      <Svg width={W} height={W}>
        {items.map((it, i) => {
          const s = point(i * seg, R);
          const e = point((i + 1) * seg, R);
          return (
            <Path
              key={it.id}
              d={`M ${C} ${C} L ${s.x} ${s.y} A ${R} ${R} 0 0 1 ${e.x} ${e.y} Z`}
              fill={colorFor(i, items.length)}
              stroke={p.cream}
              strokeWidth={3}
            />
          );
        })}
      </Svg>

      {items.map((it, i) => {
        const mid = i * seg + seg / 2;
        const pt = point(mid, R * 0.68);
        return (
          <View
            key={it.id}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: pt.x - 16,
              top: pt.y - 16,
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ rotate: `${(mid * 180) / Math.PI}deg` }],
            }}
          >
            <Icon name={it.icon} size={26} color={p.ink} />
          </View>
        );
      })}
    </View>
  );
}

export default function Ruleta() {
  const [items, setItems] = useState<Challenge[]>(DEFAULTS);
  const [text, setText] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Challenge | null>(null);

  const rot = useSharedValue(0);
  const total = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const wheelStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));

  const spin = () => {
    if (spinning) return;
    setResult(null);

    const n = items.length;
    const segDeg = 360 / n;
    const k = Math.floor(Math.random() * n);
    const jitter = (Math.random() - 0.5) * segDeg * 0.6;
    // posición final para que el centro del sector k quede bajo la flecha (arriba)
    const finalMod = (360 - (k * segDeg + segDeg / 2 + jitter) + 360) % 360;

    let target = total.current - (total.current % 360) + 360 * 5 + finalMod;
    if (target < total.current + 360 * 3) target += 360;
    total.current = target;

    setSpinning(true);
    rot.value = withTiming(target, { duration: SPIN_MS, easing: Easing.out(Easing.cubic) });
    timer.current = setTimeout(() => {
      setSpinning(false);
      setResult(items[k]);
    }, SPIN_MS + 100);
  };

  const add = () => {
    const t = text.trim();
    if (!t || items.length >= MAX) return;
    setItems((x) => [...x, { id: String(Date.now()), icon: 'star-outline', text: t }]);
    setText('');
  };

  const remove = (id: string) => {
    if (items.length <= MIN) return;
    setItems((x) => x.filter((c) => c.id !== id));
    setResult(null);
  };

  return (
    <SubScreen
      title="Ruleta de retos íntimos"
      palette={p}
      footer={
        <PrimaryButton
          p={p}
          label={spinning ? 'Girando...' : 'Girar la ruleta'}
          disabled={spinning}
          onPress={spin}
        />
      }
    >
      <View style={styles.wheelArea}>
        <View style={[styles.pointer, { borderTopColor: p.ink }]} />
        <Animated.View style={[styles.wheel, shadow(p.ink), wheelStyle]}>
          <Wheel items={items} />
        </Animated.View>
        <View style={[styles.hub, { backgroundColor: p.cream }, shadow(p.ink)]}>
          <Icon name="heart" size={22} color={p.ink} />
        </View>
      </View>

      {result ? (
        <Animated.View
          entering={FadeInDown.duration(350)}
          style={[styles.result, { backgroundColor: p.primary }, shadow(p.ink)]}
        >
          <IconBadge name={result.icon} size={72} bg={p.cream} color={p.ink} round />
          <Text style={[styles.resultText, { color: p.ink }]}>{result.text}</Text>
          <View style={styles.resultBtns}>
            <PressableScale style={[styles.resBtn, { backgroundColor: p.button }]} onPress={() => setResult(null)}>
              <Text style={[styles.resBtnText, { color: p.ink }]}>¡Lo hacemos!</Text>
            </PressableScale>
            <PressableScale style={[styles.resBtn, { backgroundColor: p.cream }]} onPress={() => setResult(null)}>
              <Text style={[styles.resBtnText, { color: p.ink }]}>Paso</Text>
            </PressableScale>
          </View>
        </Animated.View>
      ) : (
        <Text style={[styles.note, { color: p.ink }]}>
          Todos los retos son opcionales: cualquiera puede decir "paso" en cualquier momento.
        </Text>
      )}

      <Card p={p}>
        <CardTitle p={p}>{`Retos de la ruleta (${items.length}/${MAX})`}</CardTitle>
        {items.map((c) => (
          <View key={c.id} style={[styles.row, { backgroundColor: p.cream }]}>
            <IconBadge name={c.icon} size={34} bg={p.soft} color={p.ink} round />
            <Text style={[styles.rowText, { color: p.ink }]}>{c.text}</Text>
            {items.length > MIN && (
              <PressableScale onPress={() => remove(c.id)} hitSlop={8}>
                <Icon name="close" size={20} color={p.ink} />
              </PressableScale>
            )}
          </View>
        ))}

        <View style={styles.addRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Propón un reto"
            placeholderTextColor="#8A8A9A"
            maxLength={60}
            style={[styles.input, { backgroundColor: p.cream, borderColor: p.primary }]}
          />
          <PressableScale
            onPress={add}
            disabled={!text.trim() || items.length >= MAX}
            style={[
              styles.addBtn,
              { backgroundColor: p.button, opacity: !text.trim() || items.length >= MAX ? 0.5 : 1 },
            ]}
          >
            <Icon name="plus" size={24} color={p.ink} />
          </PressableScale>
        </View>
      </Card>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  wheelArea: { alignSelf: 'center', width: W, height: W + 20, alignItems: 'center', justifyContent: 'flex-end' },
  wheel: { width: W, height: W, borderRadius: W / 2 },
  pointer: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  hub: {
    position: 'absolute',
    bottom: W / 2 - 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  result: { borderRadius: 20, padding: 18, alignItems: 'center', gap: 10 },
  resultText: { fontFamily: FONT, fontSize: 18, textAlign: 'center' },
  resultBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  resBtn: { borderRadius: 14, paddingHorizontal: 18, paddingVertical: 10 },
  resBtnText: { fontFamily: BODY_BOLD, fontSize: 13 },
  note: { fontFamily: BODY, fontSize: 12, textAlign: 'center', opacity: 0.8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  rowText: { flex: 1, fontFamily: BODY, fontSize: 13 },
  addRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: { flex: 1, height: 46, borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, fontFamily: BODY, fontSize: 14, color: '#2A1F4D' },
  addBtn: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});