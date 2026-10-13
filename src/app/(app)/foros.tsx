import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSection } from '../../context/section';
import { BODY, BODY_BOLD } from '../../theme';
import { shadow, TopBar } from '../../components/ui';

export default function Foros() {
  const { section, palette: p } = useSection();
  const router = useRouter();

  const rooms: { key: string; icon: keyof typeof Icon.glyphMap; title: string; sub: string; onPress: () => void }[] = [
    { key: 'consejos', icon: 'heart-outline', title: 'Consejos sexuales', sub: 'Dudas, tips y experiencia en pareja', onPress: () => router.push('/consejos') },
    { key: 'temas', icon: 'chat-outline', title: 'Diferentes temáticas', sub: 'De todo un poco, en tema fijo', onPress: () => {} },
    { key: 'solo', icon: 'shield-lock-outline', title: section === 'hombres' ? 'Solamente hombres' : 'Solamente mujeres', sub: 'Espacio verificado, más privado', onPress: () => {} },
    { key: 'pro', icon: 'stethoscope', title: 'Profesionales', sub: 'Responden médicos y psicólogos', onPress: () => {} },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: p.cream }}>
      <TopBar palette={p} title="Entre Nos" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.featured, shadow(p.ink)]}>
          <View style={styles.featuredTitle}>
            <Icon name="star-outline" size={18} color={p.accent} />
            <Text style={[styles.title, { color: p.ink }]}>Destacado</Text>
          </View>
          <Text style={[styles.text, { color: p.ink }]}>
            Las pruebas de ITS periódicas son la forma más confiable de detectar infecciones sin síntomas visibles.
          </Text>
        </View>

        {rooms.map((r) => (
          <Pressable key={r.key} onPress={r.onPress} style={[styles.room, { backgroundColor: p.primary }, shadow(p.ink)]}>
            <View style={[styles.iconBox, { borderColor: p.ink }]}>
              <Icon name={r.icon} size={22} color={p.ink} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: p.ink }]}>{r.title}</Text>
              <Text style={[styles.text, { color: p.ink }]}>{r.sub}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, gap: 18 },
  featured: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14 },
  featuredTitle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  room: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 18 },
  iconBox: { width: 40, height: 40, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: BODY_BOLD, fontSize: 13 },
  text: { fontFamily: BODY, fontSize: 12, lineHeight: 17 },
});