import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSection } from '../context/section';
import { BODY, BODY_BOLD } from '../theme';
import { Avatar, shadow, TopBar } from '../components/ui';
import type { Palette } from '../theme';
import { useProfile } from '../context/profile';

type IconName = keyof typeof Icon.glyphMap;

type RowProps = {
  p: Palette;
  icon: IconName;
  label: string;
  toggle?: { value: boolean; onChange: (v: boolean) => void };
  onPress?: () => void;
};

function Row({ p, icon, label, toggle, onPress }: RowProps) {
  return (
    <Pressable
      disabled={!!toggle}
      onPress={onPress}
      style={[styles.row, shadow(p.ink)]}
    >
      <Icon name={icon} size={26} color={p.ink} />
      <Text style={[styles.rowLabel, { color: p.ink }]}>{label}</Text>
      {toggle ? (
        <Switch
          value={toggle.value}
          onValueChange={toggle.onChange}
          trackColor={{ false: '#D9D9D9', true: p.accent }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <Icon name="chevron-right" size={22} color={p.ink} />
      )}
    </Pressable>
  );
}

function SectionTitle({ p, children }: { p: Palette; children: string }) {
  return <Text style={[styles.section, { color: p.ink }]}>{children}</Text>;
}

export default function Ajustes() {
  const { section, palette: p } = useSection();
  const router = useRouter();
  const isMen = section === 'hombres';

  const [periodReminder, setPeriodReminder] = useState(true);
  const [forumNotifs, setForumNotifs] = useState(true);
  const [privateMode, setPrivateMode] = useState(true);
  const [biometric, setBiometric] = useState(true);

  const { profile } = useProfile();

  return (
    <View style={{ flex: 1, backgroundColor: p.cream }}>
      <TopBar
        palette={p}
        title="Ajustes"
        left={
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Icon name="arrow-left" size={26} color={p.ink} />
          </Pressable>
        }
        right={<View />}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Perfil */}
        <Pressable onPress={() => router.push('/cuenta')} style={[styles.profile, { backgroundColor: p.primary }, shadow(p.ink)]}>
          <Avatar size={46} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: p.ink }]}>{profile.name}</Text>
            <Text style={[styles.edit, { color: p.ink }]}>Editar perfil</Text>
          </View>
          <Icon name="arrow-right" size={24} color={p.ink} />
        </Pressable>

        {!isMen && (
          <>
            <SectionTitle p={p}>MI CICLO</SectionTitle>
            <Row p={p} icon="pencil-outline" label="Duración del ciclo" onPress={() => {}} />
            <Row
              p={p}
              icon="check-circle-outline"
              label="Recordatorio de periodo"
              toggle={{ value: periodReminder, onChange: setPeriodReminder }}
            />
          </>
        )}

        <SectionTitle p={p}>COMUNIDAD</SectionTitle>
        <Row p={p} icon="account-outline" label="Perfil en foros" onPress={() => router.push('/perfil-foros')} />
        <Row
          p={p}
          icon="chat-outline"
          label="Notificaciones de foros"
          toggle={{ value: forumNotifs, onChange: setForumNotifs }}
        />

        <SectionTitle p={p}>PRIVACIDAD</SectionTitle>
        <Row
          p={p}
          icon="eye-off-outline"
          label="Modo privado / blur"
          toggle={{ value: privateMode, onChange: setPrivateMode }}
        />
        <Row
          p={p}
          icon="fingerprint"
          label="Bloqueo con huella / Face ID"
          toggle={{ value: biometric, onChange: setBiometric }}
        />
        <Row p={p} icon="clipboard-text-outline" label="Datos de salud" onPress={() => router.push('/datos-salud')} />

        <SectionTitle p={p}>CUENTA</SectionTitle>
        <Row p={p} icon="email-outline" label="Correo y contraseña" onPress={() => router.push('/cuenta')} />
        <Row p={p} icon="information-outline" label="Ayuda y soporte" onPress={() => router.push('/ayuda')} />

        <Pressable onPress={() => router.replace('/')} style={styles.logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, gap: 12, paddingBottom: 40 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 14 },
  name: { fontFamily: BODY_BOLD, fontSize: 14 },
  edit: { fontFamily: BODY, fontSize: 12, opacity: 0.7, marginTop: 2 },
  section: { fontFamily: BODY_BOLD, fontSize: 11, letterSpacing: 0.5, marginTop: 10, marginLeft: 4, opacity: 0.75 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 58,
  },
  rowLabel: { flex: 1, fontFamily: BODY_BOLD, fontSize: 13 },
  logout: { alignSelf: 'center', marginTop: 16, padding: 8 },
  logoutText: { fontFamily: BODY_BOLD, fontSize: 13, color: '#D64545' },
});