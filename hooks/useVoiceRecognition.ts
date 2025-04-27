import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { useSettings } from '../context/SettingsContext';

type VoiceRecognitionStatus = 'idle' | 'listening' | 'processing' | 'error';

interface UseVoiceRecognitionReturn {
  transcript: string;
  status: VoiceRecognitionStatus;
  isListening: boolean;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  clearTranscript: () => void;
  errorMessage: string | null;
  audioLevel: number;
}

// Mock implementation for voice recognition
// In a real app, this would connect to a speech recognition API
export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<VoiceRecognitionStatus>('idle');
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const { settings } = useSettings();
  
  const recording = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (recording.current) {
        recording.current.stopAndUnloadAsync();
      }
    };
  }, []);

  // Mock function to simulate speech recognition
  // In a real app, this would process audio data and use a speech recognition service
  const mockRecognizeSpeech = async () => {
    if (Platform.OS === 'web') {
      setErrorMessage('Speech recognition not available on web');
      setStatus('error');
      return;
    }

    // Generate random audio levels for the visualization
    intervalRef.current = setInterval(() => {
      // Simulate varying audio levels
      const newLevel = Math.random() * settings.recognitionSensitivity;
      setAudioLevel(newLevel);
      
      // Occasionally add some mock detected phrases to simulate recognition
      if (Math.random() > 0.95 && isListening) {
        const mockPhrases = [
          "three two one",
          "advantage out",
          "deuce",
          "fifteen love",
          "forty thirty",
          "side out",
          "7-3-2",
          "game point"
        ];
        
        const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
        setTranscript(prev => prev ? `${prev}, ${randomPhrase}` : randomPhrase);
      }
    }, 100);
  };

  const startListening = async () => {
    try {
      setStatus('listening');
      setIsListening(true);
      setErrorMessage(null);

      // Set up audio recording
      if (Platform.OS !== 'web') {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recording.current = newRecording;
      }

      // Start mock recognition
      mockRecognizeSpeech();
    } catch (error) {
      console.error('Failed to start recording', error);
      setErrorMessage('Failed to access microphone');
      setStatus('error');
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
        recording.current = null;
      }

      setIsListening(false);
      setStatus('idle');
      setAudioLevel(0);
    } catch (error) {
      console.error('Failed to stop recording', error);
      setErrorMessage('Failed to stop recording');
      setStatus('error');
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return {
    transcript,
    status,
    isListening,
    startListening,
    stopListening,
    clearTranscript,
    errorMessage,
    audioLevel
  };
};