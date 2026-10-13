import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { BODY, BODY_BOLD, FONT, PALETTES } from '../../theme';
import { shadow, TopBar } from '../../components/ui';

const p = PALETTES.parejas;

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={[styles.block, shadow(p.ink)]}>
      <View style={styles.clip}>
        <View style={[styles.head, { backgroundColor: p.accent }]}>
          <Text style={styles.headText}>{title}</Text>
        </View>
        <View style={styles.body}>{children}</View>
      </View>
    </View>
  );
}

export default function Pareja() {
  return (
    <View style={{ flex: 1, backgroundColor: p.cream }}>
      <TopBar palette={p} title="Entre Nos - Parejas" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Block title="Ciclo de tu pareja">
          <View style={styles.row}>
            <Icon name="information-outline" size={26} color={p.ink} />
            <View style={{ flex: 1, gap: 6 }}>
              <View style={[styles.chip, { backgroundColor: p.soft }]}>
                <Text style={styles.chipText}>Ovulación (día 14)</Text>
              </View>
              <Text style={styles.text}>
                Energía y deseo suelen estar más altos hoy: buen momento para pensar algo especial.
              </Text>
            </View>
          </View>
        </Block>

        <Block title="Sugerencia de la semana">
          <View style={styles.row}>
            <Icon name="gamepad-variant-outline" size={34} color={p.ink} />
            <View style={{ flex: 1 }}>
              <Text style={styles.strong}>Título de la sugerencia</Text>
              <Text style={styles.text}>Nivel: principiante</Text>
            </View>
            <Pressable style={[styles.btn, { backgroundColor: p.button }]}>
              <Text style={styles.btnText}>Ver guía</Text>
            </Pressable>
          </View>
        </Block>

        <Block title="Actividades mutuas">
          <View style={{ gap: 10, alignItems: 'center' }}>
            <Pressable style={[styles.btn, { backgroundColor: '#FFFFFF' }]}>
              <Text style={styles.btnText}>Ruleta de retos íntimos</Text>
            </Pressable>
            <Pressable style={[styles.btn, { backgroundColor: p.accent }]}>
              <Text style={[styles.btnText, { color: '#FFFFFF' }]}>+ Nueva ruleta</Text>
            </Pressable>
          </View>
        </Block>

        <View style={[styles.tip, shadow(p.ink)]}>
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
  block: { borderRadius: 16, backgroundColor: p.primary },
  clip: { borderRadius: 16, overflow: 'hidden' },
  head: { paddingHorizontal: 14, paddingVertical: 9 },
  headText: { color: '#FFFFFF', fontFamily: FONT, fontSize: 13 },
  body: { backgroundColor: p.primary, padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chip: { alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontFamily: BODY_BOLD, fontSize: 11, color: p.ink },
  text: { fontFamily: BODY, fontSize: 12, lineHeight: 17, color: p.ink },
  strong: { fontFamily: BODY_BOLD, fontSize: 13, color: p.ink },
  btn: { borderRadius: 14, paddingHorizontal: 16, paddingVertical: 9 },
  btnText: { fontFamily: BODY_BOLD, fontSize: 12, color: p.ink },
  tip: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16 },
});