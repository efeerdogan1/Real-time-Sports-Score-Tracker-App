import { useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSettings } from '../context/SettingsContext';

interface UseVoiceAnnouncementReturn {
  announce: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

export const useVoiceAnnouncement = (): UseVoiceAnnouncementReturn => {
  const { settings } = useSettings();
  const isSpeakingRef = useRef(false);

  // Initialize speech synthesis
  useEffect(() => {
    return () => {
      // Cleanup
      stopSpeaking();
    };
  }, []);

  const announce = async (text: string): Promise<void> => {
    try {
      // Stop any current speech
      stopSpeaking();
      
      // Trigger haptic feedback if enabled and platform supports it
      if (settings.enableHaptics && Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      isSpeakingRef.current = true;
      
      // Use the selected voice
      await Speech.speak(text, {
        language: settings.announcementVoice,
        pitch: 1.0,
        rate: 0.9,
        volume: settings.announcementVolume,
        onDone: () => {
          isSpeakingRef.current = false;
        },
        onError: () => {
          isSpeakingRef.current = false;
        }
      });
    } catch (error) {
      console.error('Failed to speak:', error);
      isSpeakingRef.current = false;
    }
  };

  const stopSpeaking = (): void => {
    Speech.stop();
    isSpeakingRef.current = false;
  };

  return {
    announce,
    stopSpeaking,
    isSpeaking: isSpeakingRef.current
  };
};