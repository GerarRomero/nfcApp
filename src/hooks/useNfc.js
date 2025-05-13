// src/hooks/useNfc.js
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

const FALLBACK_TECHS = [NfcTech.NfcA, NfcTech.NfcV, NfcTech.IsoDep];

/** Lee un tag NFC con reintento multi-tecnología */
export async function readTag(timeoutMs = 15000) {
  await NfcManager.start().catch(() => null);

  if (!(await NfcManager.isEnabled())) {
    return { ok: false, msg: 'NFC desactivado en ajustes.' };
  }

  let timeoutId;
  const withTimeout = p =>
    Promise.race([
      p,
      new Promise((_, rej) =>
        timeoutId = setTimeout(() => rej(new Error('Tiempo agotado')), timeoutMs),
      ),
    ]);

  const tryTech = async techs => {
    await NfcManager.requestTechnology(techs, { alertMessage: 'Acerque la tarjeta…' });
    const tag = await NfcManager.getTag();
    await NfcManager.cancelTechnologyRequest();
    return tag?.id || null;
  };

  try {
    // 1️⃣  primer intento: Ndef
    const id1 = await withTimeout(tryTech(NfcTech.Ndef));
    if (id1) return { ok: true, id: id1 };

    // 2️⃣  fallback: otras tecnologías
    const id2 = await withTimeout(tryTech(FALLBACK_TECHS));
    if (id2) return { ok: true, id: id2 };

    return { ok: false, msg: 'Tag sin UID legible.' };
  } catch (err) {
    // si requestTechnology falla o timeout
    await NfcManager.cancelTechnologyRequest().catch(() => 0);
    return { ok: false, msg: err.message || 'No se detectó ninguna tarjeta.' };
  } finally {
    clearTimeout(timeoutId);
  }
}
