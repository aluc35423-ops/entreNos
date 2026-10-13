import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SubScreen from '../components/SubScreen';
import IconBadge from '../components/IconBadge';
import { Card, CardTitle, LabeledInput, PrimaryButton, SwitchRow } from '../components/form';
import { PressableScale } from '../components/PressableScale';
import { useSection } from '../context/section';
import { useProfile } from '../context/profile';
import { BODY, BODY_BOLD, FONT } from '../theme';

type IconName = keyof typeof Icon.glyphMap;

const AVATARS: IconName[] = [
  'flower-outline',
  'butterfly-outline',
  'owl',
  'rabbit',
  'cat',
  'turtle',
  'weather-night',
  'star-outline',
];

export default function PerfilForos() {
  const { section, palette: p } = useSection();
  const { profile, update } = useProfile();
  const router = useRouter();

  const [d, setD] = useState({
    alias: profile.alias,
    avatar: profile.avatar,
    bio: profile.bio,
    showAlias: profile.showAlias,
    approveFollowers: profile.approveFollowers,
    allowDMs: profile.allowDMs,
    showSection: profile.showSection,
  });
  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => setD((x) => ({ ...x, [k]: v }));

  const shownName = d.showAlias && d.alias.trim() ? d.alias.trim() : 'Usuario anónimo';
  const sectionLabel = section === 'hombres' ? 'Sección hombres' : 'Sección mujeres';

  return (
    <SubScreen
      title="Perfil en foros"
      footer={
        <PrimaryButton
          p={p}
          label="Guardar"
          onPress={() => {
            update({ ...d, alias: d.alias.trim(), bio: d.bio.trim() });
            router.back();
          }}
        />
      }
    >
      {/* Vista previa */}
      <Card p={p} style={styles.preview}>
        <IconBadge name={d.avatar as IconName} size={84} bg={p.primary} color={p.ink} round />
        <Text style={[styles.name, { color: p.ink }]}>{shownName}</Text>
        {d.showSection && (
          <Text style={[styles.tag, { color: p.ink, backgroundColor: p.highlight }]}>{sectionLabel}</Text>
        )}
        {!!d.bio.trim() && <Text style={[styles.bio, { color: p.ink }]}>{d.bio}</Text>}
      </Card>

      <Card p={p}>
        <CardTitle p={p}>Avatar</CardTitle>
        <View style={styles.avatars}>
          {AVATARS.map((a) => (
            <PressableScale
              key={a}
              onPress={() => set('avatar', a)}
              scaleTo={0.9}
              style={[
                styles.avatarOpt,
                { backgroundColor: p.cream, borderColor: d.avatar === a ? p.ink : 'transparent' },
              ]}
            >
              <Icon name={a} size={28} color={p.ink} />
            </PressableScale>
          ))}
        </View>
      </Card>

      <Card p={p}>
        <CardTitle p={p}>Cómo te ven</CardTitle>
        <LabeledInput
          p={p}
          label="Alias"
          value={d.alias}
          onChangeText={(v) => set('alias', v)}
          placeholder="Ej. LunaDeOctubre"
          maxLength={20}
        />
        <LabeledInput
          p={p}
          label={`Sobre mí (${d.bio.length}/80)`}
          value={d.bio}
          onChangeText={(v) => set('bio', v)}
          placeholder="Una frase corta"
          maxLength={80}
        />
      </Card>

      <Card p={p}>
        <CardTitle p={p}>Privacidad</CardTitle>
        <SwitchRow
          p={p}
          label="Usar mi alias"
          hint="Si lo apagas, apareces como usuario anónimo"
          value={d.showAlias}
          onChange={(v) => set('showAlias', v)}
        />
        <SwitchRow
          p={p}
          label="Mostrar mi sección"
          hint="Muestra si participas desde mujeres u hombres"
          value={d.showSection}
          onChange={(v) => set('showSection', v)}
        />
        <SwitchRow
          p={p}
          label="Aprobar a quien me siga"
          value={d.approveFollowers}
          onChange={(v) => set('approveFollowers', v)}
        />
        <SwitchRow
          p={p}
          label="Permitir mensajes directos"
          value={d.allowDMs}
          onChange={(v) => set('allowDMs', v)}
        />
      </Card>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  preview: { alignItems: 'center', gap: 8 },
  name: { fontFamily: FONT, fontSize: 18 },
  tag: {
    fontFamily: BODY_BOLD,
    fontSize: 11,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  bio: { fontFamily: BODY, fontSize: 13, textAlign: 'center' },
  avatars: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  avatarOpt: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
});