import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import IconBadge from '../../components/IconBadge';
import { PressableScale as Pressable } from '../../components/PressableScale';
import { WEEKLY_GUIDE as G } from '../../data/guides';
import { BODY, BODY_BOLD, FONT, PALETTES } from '../../theme';
import { shadow, TopBar } from '../../components/ui';

const p = PALETTES.parejas;

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={[styles.block, shadow(p.ink)]}>
      <View style={styles.clip}>
        <View style={[styles.head, { backgroundColor: p.primary }]}>
          <Text style={styles.headText}>{title}</Text>
        </View>
        <View style={[styles.body, { backgroundColor: p.soft }]}>{children}</View>
      </View>
    </View>
  );
}

export default function Pareja() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: p.cream }}>
      <TopBar palette={p} title="Entre Nos - Parejas" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Block title="Ciclo de tu pareja">
          <View style={styles.row}>
            <Icon name="information-outline" size={26} color={p.ink} />
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={[styles.chip, { backgroundColor: p.highlight }]}>Ovulación (día 14)</Text>
              <Text style={styles.text}>
                Energía y deseo suelen estar más altos hoy: buen momento para pensar algo especial.
              </Text>
            </View>
          </View>
        </Block>

        <Block title="Sugerencia de la semana">
          <View style={styles.row}>
            <IconBadge name={G.icon} size={52} bg={p.primary} color={p.ink} />
            <View style={{ flex: 1 }}>
              <Text style={styles.strong}>{G.title}</Text>
              <Text style={styles.text}>{`Nivel: ${G.level.toLowerCase()}`}</Text>
            </View>
            <Pressable style={[styles.btn, { backgroundColor: p.button }]} onPress={() => router.push('/guia')}>
              <Text style={styles.btnText}>Ver guía</Text>
            </Pressable>
          </View>
        </Block>

        <Block title="Actividades mutuas">
          <View style={{ gap: 10, alignItems: 'center' }}>
            <Pressable style={[styles.btn, { backgroundColor: p.button }]} onPress={() => router.push('/ruleta')}>
              <Text style={styles.btnText}>Ruleta de retos íntimos</Text>
            </Pressable>
            <Pressable style={[styles.btn, { backgroundColor: p.cream }]} onPress={() => router.push('/ruleta')}>
              <Text style={styles.btnText}>+ Proponer un reto</Text>
            </Pressable>
          </View>
        </Block>

        <View style={[styles.tip, { backgroundColor: p.cream }, shadow(p.ink)]}>
          <Text style={styles.strong}>Tip para hoy</Text>
          <Text style={[styles.text, { marginTop: 6 }]}>
            Hablar abiertamente de lo que cada quien necesita en esta fase del ciclo fortalece la confianza en la pareja.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, gap: 20 },
  block: { borderRadius: 16, backgroundColor: p.soft },
  clip: { borderRadius: 16, overflow: 'hidden' },
  head: { paddingHorizontal: 14, paddingVertical: 9 },
  headText: { color: p.ink, fontFamily: FONT, fontSize: 13 },
  body: { padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chip: {
    alignSelf: 'flex-start',
    fontFamily: BODY_BOLD,
    fontSize: 11,
    color: p.ink,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  text: { fontFamily: BODY, fontSize: 12, lineHeight: 17, color: p.ink },
  strong: { fontFamily: BODY_BOLD, fontSize: 13, color: p.ink },
  btn: { borderRadius: 14, paddingHorizontal: 16, paddingVertical: 9 },
  btnText: { fontFamily: BODY_BOLD, fontSize: 12, color: p.ink },
  tip: { borderRadius: 14, padding: 16 },
});