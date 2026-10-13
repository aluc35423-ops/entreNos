import { useState } from 'react';
import Sheet from '../components/Sheet';
import { LabeledInput } from '../components/form';
import { useSection } from '../context/section';
import { useLog } from '../context/log';

export default function Nota() {
  const { palette: p } = useSection();
  const { get, update } = useLog();
  const [text, setText] = useState('');

  return (
    <Sheet
      title="Nueva nota"
      subtitle="Hoy"
      saveDisabled={!text.trim()}
      onSave={() => update({ notes: [...get().notes, text.trim()] })}
    >
      <LabeledInput
        p={p}
        label="¿Qué quieres recordar de hoy?"
        value={text}
        onChangeText={setText}
        placeholder="Escribe tu nota..."
        multiline
        maxLength={280}
        style={{ height: 140, paddingTop: 12, textAlignVertical: 'top' }}
      />
    </Sheet>
  );
}