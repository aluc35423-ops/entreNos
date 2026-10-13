import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSection } from '../../context/section';
import { MONTHS } from '../../utils/dates';
import { BODY, BODY_BOLD, FONT, LOGO_FONT } from '../../theme';
import { AvatarButton, shadow } from '../../components/ui';

type IconName = keyof typeof Icon.glyphMap;
type Action = { key: string; label: string; icon: IconName; onPress: () => void };

const PRODUCTS: { id: string; name: string; price: string; icon: IconName }[] = [
  { id: '1', name: 'Lubricante', price: '$109', icon: 'bottle-tonic-outline' },
  { id: '2', name: 'Preservativos x18', price: '$99', icon: 'shield-check-outline' },
  { id: '3', name: 'Copa menstrual', price: '$249', icon: 'cup-water' },
];

const PERIOD_DAY = 5; // dato de ejemplo

export default function Home() {
  const { section, palette: p } = useSection();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isMen = section === 'hombres';

  const today = new Date();
  const days = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i - 2);
    return d.getDate();
  });

  const actions: (Action | false)[] = [
    !isMen && { key: 'edit', label: 'Editar periodo', icon: 'pencil-outline', onPress: () => router.push('/calendario') },
    { key: 'sym', label: 'Síntomas', icon: 'plus', onPress: () => {} },
    { key: 'sex', label: 'Sexo', icon: 'heart-outline', onPress: () => {} },
    { key: 'chk', label: 'Check-in', icon: 'clipboard-check-outline', onPress: () => {} },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: p.cream }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={[styles.header, { backgroundColor: p.primary, paddingTop: insets.top + 8 }, shadow(p.ink)]}>
          <View style={styles.topRow}>
            <View style={styles.sideL}>
              <Text style={[styles.brand, { color: p.ink }]}>Entre Nos</Text>
            </View>
            <Text style={[styles.month, { color: p.ink }]}>{MONTHS[today.getMonth()].toUpperCase()}</Text>
              <View style={styles.sideR}>
                <AvatarButton size={34} />
              </View>
          </View>

          {!isMen && (
            <Pressable style={styles.days} onPress={() => router.push('/calendario')}>
              {days.map((d, i) => (
                <View key={i} style={[styles.day, i === 1 && styles.dayNear, i === 2 && styles.dayToday]}>
                  <Text style={[styles.dayText, { color: p.ink }]}>{d}</Text>
                </View>
              ))}
            </Pressable>
          )}

          <Text style={[styles.period, { color: p.ink }]}>{`Periodo:\nDía ${PERIOD_DAY}`}</Text>

          <View style={styles.actions}>
            {actions
              .filter((a): a is Action => a !== false)
              .map((a) => (
                <Pressable key={a.key} onPress={a.onPress} style={styles.action}>
                  <View style={[styles.actionCircle, shadow(p.ink)]}>
                    <Icon name={a.icon} size={24} color={p.ink} />
                  </View>
                  <Text style={[styles.actionLabel, { color: p.ink }]}>{a.label}</Text>
                </Pressable>
              ))}
          </View>
        </View>

        <Text style={[styles.seeAll, { color: p.ink }]}>Ver todo</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.products}>
          {PRODUCTS.map((pr) => (
            <View key={pr.id} style={[styles.product, { backgroundColor: p.soft }, shadow(p.ink)]}>
              <View style={styles.productImg}>
                <Icon name={pr.icon} size={56} color={p.accent} />
              </View>
              <Text style={[styles.productName, { color: p.ink }]}>{pr.name}</Text>
              <Text style={[styles.productPrice, { color: p.ink }]}>{pr.price}</Text>
            </View>
          ))}
        </ScrollView>

        {!isMen && (
          <View style={[styles.tip, { backgroundColor: p.primary }, shadow(p.ink)]}>
            <View style={styles.tipTitleRow}>
              <Icon name="lightbulb-on-outline" size={20} color={p.ink} />
              <Text style={[styles.tipTitle, { color: p.ink }]}>Tip de tu ciclo</Text>
            </View>
            <Text style={[styles.tipText, { color: p.ink }]}>
              En esta fase es normal sentir más cansancio. Prioriza el descanso y mucha agua.
            </Text>
          </View>
        )}

        <View style={styles.healthRow}>
          <View style={[styles.healthIcon, { backgroundColor: p.accent }]}>
            <Icon name="heart-pulse" size={22} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.tipTitle, { color: p.ink }]}>Tip de salud</Text>
            <Text style={[styles.tipText, { color: p.ink }]}>
              Las pruebas de ITS periódicas son la forma más confiable de detectar infecciones sin síntomas visibles.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { borderBottomLeftRadius: 36, borderBottomRightRadius: 36, paddingHorizontal: 18, paddingBottom: 22 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  sideL: { flex: 1, alignItems: 'flex-start' },
  sideR: { flex: 1, alignItems: 'flex-end' },
  brand: { fontFamily: LOGO_FONT, fontSize: 16 },
  month: { fontFamily: BODY_BOLD, fontSize: 13, letterSpacing: 1 },
  days: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  day: { width: 46, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dayNear: { backgroundColor: 'rgba(255,255,255,0.5)' },
  dayToday: { backgroundColor: '#FFFFFF' },
  dayText: { fontFamily: BODY_BOLD, fontSize: 13 },
  period: { fontFamily: FONT, fontSize: 22, textAlign: 'center', marginVertical: 22 },
  actions: { flexDirection: 'row', justifyContent: 'space-around' },
  action: { alignItems: 'center', gap: 6 },
  actionCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontFamily: BODY_BOLD, fontSize: 11 },
  seeAll: { alignSelf: 'flex-end', fontFamily: BODY_BOLD, fontSize: 11, marginRight: 18, marginTop: 14 },
  products: { paddingHorizontal: 18, paddingVertical: 10, gap: 14 },
  product: { width: 150, borderRadius: 18, padding: 10 },
  productImg: { height: 110, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  productName: { fontFamily: BODY_BOLD, fontSize: 12, marginTop: 10 },
  productPrice: { fontFamily: BODY, fontSize: 11, marginTop: 4 },
  tip: { marginHorizontal: 18, marginTop: 14, borderRadius: 16, padding: 14 },
  tipTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  tipTitle: { fontFamily: BODY_BOLD, fontSize: 12 },
  tipText: { fontFamily: BODY, fontSize: 12, lineHeight: 17 },
  healthRow: { flexDirection: 'row', gap: 12, marginHorizontal: 18, marginTop: 18, alignItems: 'flex-start' },
  healthIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});