import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import SubScreen from '../components/SubScreen';
import { Card, CardTitle, LabeledInput, PrimaryButton } from '../components/form';
import { PressableScale } from '../components/PressableScale';
import { useSection } from '../context/section';
import { useProfile } from '../context/profile';
import { BODY, BODY_BOLD } from '../theme';

type Msg = { ok: boolean; text: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Cuenta() {
  const { palette: p } = useSection();
  const { profile, update } = useProfile();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [nameMsg, setNameMsg] = useState<Msg>(null);
  const [emailMsg, setEmailMsg] = useState<Msg>(null);
  const [passMsg, setPassMsg] = useState<Msg>(null);

  const saveName = () => {
    if (!name.trim()) return setNameMsg({ ok: false, text: 'Escribe tu nombre' });
    update({ name: name.trim() });
    setNameMsg({ ok: true, text: 'Nombre actualizado' });
  };

  const saveEmail = () => {
    if (!EMAIL_RE.test(email.trim())) return setEmailMsg({ ok: false, text: 'Escribe un correo válido' });
    // TODO: enviar al servidor y confirmar el correo nuevo
    update({ email: email.trim() });
    setEmailMsg({ ok: true, text: 'Correo actualizado' });
  };

  const savePass = () => {
    if (!current) return setPassMsg({ ok: false, text: 'Escribe tu contraseña actual' });
    if (next.length < 8) return setPassMsg({ ok: false, text: 'La nueva contraseña debe tener al menos 8 caracteres' });
    if (next !== confirm) return setPassMsg({ ok: false, text: 'Las contraseñas no coinciden' });
    // TODO: enviar al servidor
    setCurrent('');
    setNext('');
    setConfirm('');
    setPassMsg({ ok: true, text: 'Contraseña actualizada' });
  };

  const note = (m: Msg) =>
    m && <Text style={[styles.msg, { color: m.ok ? p.accent : '#D64545' }]}>{m.text}</Text>;

  return (
    <SubScreen title="Correo y contraseña">
      <Card p={p}>
        <CardTitle p={p}>Nombre</CardTitle>
        <LabeledInput p={p} label="Tu nombre" value={name} onChangeText={setName} autoCapitalize="words" />
        {note(nameMsg)}
        <PrimaryButton p={p} label="Guardar nombre" onPress={saveName} />
      </Card>

      <Card p={p}>
        <CardTitle p={p}>Correo</CardTitle>
        <LabeledInput p={p} label="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="tucorreo@ejemplo.com" />
        {note(emailMsg)}
        <PrimaryButton p={p} label="Guardar correo" onPress={saveEmail} />
      </Card>

      <Card p={p}>
        <CardTitle p={p}>Contraseña</CardTitle>
        <LabeledInput p={p} label="Contraseña actual" value={current} onChangeText={setCurrent} secureTextEntry={!show} autoCapitalize="none" />
        <LabeledInput p={p} label="Nueva contraseña" value={next} onChangeText={setNext} secureTextEntry={!show} autoCapitalize="none" />
        <LabeledInput p={p} label="Confirmar nueva contraseña" value={confirm} onChangeText={setConfirm} secureTextEntry={!show} autoCapitalize="none" />
        <PressableScale onPress={() => setShow((s) => !s)} style={styles.toggle}>
          <Text style={[styles.toggleText, { color: p.ink }]}>{show ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}</Text>
        </PressableScale>
        {note(passMsg)}
        <PrimaryButton p={p} label="Cambiar contraseña" onPress={savePass} />
      </Card>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  msg: { fontFamily: BODY_BOLD, fontSize: 12 },
  toggle: { alignSelf: 'flex-start' },
  toggleText: { fontFamily: BODY, fontSize: 12, textDecorationLine: 'underline' },
});