// src/components/Toast.js
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export default function Toast({ type = 'success', children, duration = 2500, onHide }) {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(duration),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onHide?.());
  }, []);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          opacity,
          backgroundColor: type === 'success' ? '#4caf50' : '#e53935',
        },
      ]}
    >
      <Text style={styles.text}>{children}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  text: { color: '#fff', fontWeight: '600' },
});
