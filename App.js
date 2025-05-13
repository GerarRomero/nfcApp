// App.js (versión simplificada, sin cámara todavía)
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from './src/components/Toast';
import CameraCapture from './src/components/CameraCapture';
import { readTag } from './src/hooks/useNfc';

const COLORS = {
  primary:  '#003d7c', // corporativo
  primaryLight: '#4d79b3',
  bg: '#f4f7fb',
  text: '#1a1a1a',
};

export default function App() {
  const [state, setState]     = useState('idle');
  const [nfcId, setNfcId]     = useState(null);
  const [photo, setPhoto]     = useState(null);
  const [guardUser, setGuardUser] = useState('');
  const [toast, setToast]     = useState(null);       // {type:'success'|'error', msg:''}

  const startFlow = async () => {
    if (!guardUser.trim()) {
      setToast({type:'error', msg:'Ingresa tu usuario primero'});
      return;
    }
    setState('waitingNfc');
    const res = await readTag();
    if (res.ok) {
      setNfcId(res.id);
      console.log('TAG completo →', res.id);  
      setState('capturing');   // en 4.4 abriremos cámara aquí
    } else {
      setToast({type:'error', msg: res.msg});
      setState('idle');
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: COLORS.bg}]}>
      {/* Título */}
      <Text style={styles.title}>Registro de Visita</Text>

      {/* Input guardia */}
      <TextInput
        style={styles.input}
        placeholder="Usuario del guardia"
        value={guardUser}
        onChangeText={setGuardUser}
      />

      {/* Botón principal */}
      {state === 'idle' && (
        <TouchableOpacity style={styles.btn} onPress={startFlow}>
          <Text style={styles.btnTxt}>Registrar visita</Text>
        </TouchableOpacity>
      )}

      {/* Esperando NFC */}
      {state === 'waitingNfc' && (
        <>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.subtitle}>Acerque la tarjeta NFC…</Text>
        </>
      )}

      {/* Los demás estados se completarán en pasos 4.4 – 4.7 */}
      {state === 'capturing' && (
        <CameraCapture
          onCancel={() => setState('idle')}
          onCapture={p => {
            setPhoto(p);          // { uri, base64, width, height }
            setState('review');   // sub-tarea 4.5
          }}
        />
      )}

      {/* Toast */}
      {toast && <Toast type={toast.type} onHide={() => setToast(null)}>{toast.msg}</Toast>}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',alignItems:'center',padding:24},
  title:{fontSize:24,fontWeight:'700',color:COLORS.primary,marginBottom:24},
  subtitle:{marginTop:16,color:COLORS.text},
  input:{width:'100%',maxWidth:320,backgroundColor:'#fff',borderRadius:8,padding:12,
         borderWidth:1,borderColor:'#d0d7e2',marginBottom:16},
  btn:{backgroundColor:COLORS.primary,paddingVertical:14,paddingHorizontal:32,
       borderRadius:8},
  btnTxt:{color:'#fff',fontWeight:'600',fontSize:16},
});
