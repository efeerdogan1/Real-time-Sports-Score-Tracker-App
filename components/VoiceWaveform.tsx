import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { useSettings } from '../context/SettingsContext';

interface VoiceWaveformProps {
  audioLevel: number;
  isListening: boolean;
}

const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ audioLevel, isListening }) => {
  const { settings } = useSettings();
  
  // Create an array of animated values for each bar
  const barCount = 7;
  const barRefs = useRef<Animated.Value[]>(
    Array.from({ length: barCount }, () => new Animated.Value(0))
  );

  useEffect(() => {
    if (isListening) {
      // Animate each bar with a slight delay to create a wave effect
      barRefs.current.forEach((bar, index) => {
        const delay = index * 50;
        const randomFactor = 0.5 + Math.random() * 1.0;
        const targetValue = Math.min(1, audioLevel * settings.recognitionSensitivity * randomFactor);
        
        Animated.sequence([
          Animated.delay(delay),
          Animated.spring(bar, {
            toValue: targetValue,
            friction: 8,
            tension: 40,
            useNativeDriver: false,
          })
        ]).start();
      });
    } else {
      // Reset all bars when not listening
      barRefs.current.forEach(bar => {
        Animated.spring(bar, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [audioLevel, isListening, settings.recognitionSensitivity]);

  return (
    <View style={styles.container}>
      {barRefs.current.map((bar, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              height: bar.interpolate({
                inputRange: [0, 1],
                outputRange: ['10%', '100%']
              }),
              backgroundColor: isListening ? '#4CAF50' : '#CFD8DC'
            }
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    paddingHorizontal: 16,
    width: '100%'
  },
  bar: {
    width: 8,
    borderRadius: 10,
    backgroundColor: '#4CAF50'
  }
});

export default VoiceWaveform;