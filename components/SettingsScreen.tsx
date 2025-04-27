import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { Volume2, VolumeX, Mic, FileSliders as Sliders, Bell, BellOff, Info as InfoIcon } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettings();

  const toggleHaptics = () => {
    updateSettings({ enableHaptics: !settings.enableHaptics });
  };

  const toggleNoiseCancellation = () => {
    updateSettings({ enableBackgroundNoiseCancellation: !settings.enableBackgroundNoiseCancellation });
  };

  const toggleAutoEndMatches = () => {
    updateSettings({ autoEndMatches: !settings.autoEndMatches });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice Announcements</Text>
        
        <View style={styles.setting}>
          <View style={styles.settingHeader}>
            {settings.announcementVolume > 0 ? (
              <Volume2 size={24} color="#333" />
            ) : (
              <VolumeX size={24} color="#333" />
            )}
            <Text style={styles.settingTitle}>Announcement Volume</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={settings.announcementVolume}
            onValueChange={(value) => updateSettings({ announcementVolume: value })}
            minimumTrackTintColor="#1A659E"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#1A659E"
          />
          <Text style={styles.sliderValue}>
            {Math.round(settings.announcementVolume * 100)}%
          </Text>
        </View>
        
        <View style={styles.setting}>
          <View style={styles.settingHeader}>
            <Mic size={24} color="#333" />
            <Text style={styles.settingTitle}>Voice Accent</Text>
          </View>
          
          <View style={styles.radioGroup}>
            {['American', 'British', 'Australian'].map((accent) => (
              <TouchableOpacity
                key={accent}
                style={[
                  styles.radioButton,
                  settings.accentType === accent && styles.radioButtonSelected
                ]}
                onPress={() => updateSettings({ 
                  accentType: accent,
                  announcementVoice: accent === 'American' ? 'en-US' : 
                                      accent === 'British' ? 'en-GB' : 'en-AU'
                })}
              >
                <Text style={[
                  styles.radioText,
                  settings.accentType === accent && styles.radioTextSelected
                ]}>
                  {accent}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recognition Settings</Text>
        
        <View style={styles.setting}>
          <View style={styles.settingHeader}>
            <Sliders size={24} color="#333" />
            <Text style={styles.settingTitle}>Microphone Sensitivity</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0.1}
            maximumValue={1}
            value={settings.recognitionSensitivity}
            onValueChange={(value) => updateSettings({ recognitionSensitivity: value })}
            minimumTrackTintColor="#1A659E"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#1A659E"
          />
          <Text style={styles.sliderValue}>
            {Math.round(settings.recognitionSensitivity * 100)}%
          </Text>
        </View>
        
        <View style={styles.switchSetting}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.settingTitle}>Background Noise Cancellation</Text>
            <Text style={styles.settingDescription}>
              Filter out ambient court noise for better score recognition
            </Text>
          </View>
          <Switch
            value={settings.enableBackgroundNoiseCancellation}
            onValueChange={toggleNoiseCancellation}
            trackColor={{ false: '#ddd', true: '#1A659E' }}
            thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Settings</Text>
        
        <View style={styles.switchSetting}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.settingTitle}>Haptic Feedback</Text>
            <Text style={styles.settingDescription}>
              Vibration feedback for score changes and recognition
            </Text>
          </View>
          <Switch
            value={settings.enableHaptics}
            onValueChange={toggleHaptics}
            trackColor={{ false: '#ddd', true: '#1A659E' }}
            thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
          />
        </View>
        
        <View style={styles.switchSetting}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.settingTitle}>Auto-End Matches</Text>
            <Text style={styles.settingDescription}>
              Automatically end and save matches when game is won
            </Text>
          </View>
          <Switch
            value={settings.autoEndMatches}
            onValueChange={toggleAutoEndMatches}
            trackColor={{ false: '#ddd', true: '#1A659E' }}
            thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
          />
        </View>
      </View>
      
      <View style={styles.aboutSection}>
        <TouchableOpacity style={styles.aboutButton}>
          <InfoIcon size={18} color="#1A659E" />
          <Text style={styles.aboutButtonText}>About this App</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={resetSettings}
        >
          <Text style={styles.resetButtonText}>Reset All Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  setting: {
    marginBottom: 20,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  slider: {
    height: 40,
    width: '100%',
  },
  sliderValue: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  switchSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  radioButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    margin: 4,
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#1A659E',
    backgroundColor: '#1A659E',
  },
  radioText: {
    fontSize: 14,
    fontWeight: '600',
  },
  radioTextSelected: {
    color: 'white',
  },
  aboutSection: {
    marginVertical: 24,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  aboutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  aboutButtonText: {
    color: '#1A659E',
    fontWeight: '600',
    marginLeft: 8,
  },
  resetButton: {
    paddingVertical: 10,
  },
  resetButtonText: {
    color: '#E53935',
    fontWeight: '600',
  },
});

export default SettingsScreen;