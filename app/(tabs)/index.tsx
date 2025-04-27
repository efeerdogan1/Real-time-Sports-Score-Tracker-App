import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { Mic, MicOff, Play, Plus } from 'lucide-react-native';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { useVoiceAnnouncement } from '../../hooks/useVoiceAnnouncement';
import VoiceWaveform from '../../components/VoiceWaveform';
import Scoreboard from '../../components/Scoreboard';
import NewMatchModal from '../../components/NewMatchModal';
import { useMatch } from '../../context/MatchContext';
import { useSettings } from '../../context/SettingsContext';
import { formatScore, recognizeScoreFromSpeech } from '../../utils/scoreUtils';

export default function ScoreTrackerScreen() {
  const { transcript, status, isListening, startListening, stopListening, clearTranscript, audioLevel } = useVoiceRecognition();
  const { announce } = useVoiceAnnouncement();
  const { currentMatch, startNewMatch, updateMatch, endMatch } = useMatch();
  const { settings } = useSettings();
  
  const [showNewMatchModal, setShowNewMatchModal] = useState(false);
  const [lastScoreUpdate, setLastScoreUpdate] = useState(0);
  
  // Effect to watch for score changes in transcript
  useEffect(() => {
    if (currentMatch && transcript && !settings.autoEndMatches) {
      const recognizedState = recognizeScoreFromSpeech(transcript, currentMatch);
      
      if (recognizedState) {
        updateMatch(recognizedState);
        setLastScoreUpdate(Date.now());
        
        // Announce the new score
        const formattedScore = formatScore(recognizedState);
        announce(formattedScore);
        
        // Clear transcript after processing
        clearTranscript();
      }
    }
  }, [transcript, currentMatch]);
  
  // Request microphone permission on component mount
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const requestMicPermission = async () => {
        try {
          await startListening();
          stopListening();
        } catch (error) {
          Alert.alert(
            "Microphone Access Required",
            "This app needs microphone access to detect score callouts. Please enable microphone access in your device settings."
          );
        }
      };
      
      requestMicPermission();
    }
  }, []);

  const toggleListening = async () => {
    if (isListening) {
      await stopListening();
    } else {
      if (!currentMatch) {
        setShowNewMatchModal(true);
      } else {
        await startListening();
        // Announce that we're listening
        announce("Listening for score callouts");
      }
    }
  };
  
  const handleCreateMatch = (sport, teamAName, teamBName) => {
    startNewMatch(sport, teamAName, teamBName);
    
    // Start listening after a short delay to allow the UI to update
    setTimeout(async () => {
      await startListening();
      // Announce match start
      announce(`New ${sport} match started. ${teamAName} versus ${teamBName}`);
    }, 500);
  };
  
  const handleEndMatch = () => {
    if (isListening) {
      stopListening();
    }
    
    Alert.alert(
      "End Match",
      "Are you sure you want to end this match? The score will be saved to your history.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "End Match",
          onPress: () => {
            endMatch();
            announce("Match ended and saved to history");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentMatch ? (
        <>
          <Scoreboard 
            scoreState={currentMatch} 
            lastUpdated={lastScoreUpdate}
          />
          
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptLabel}>Recognized Speech:</Text>
            <Text style={styles.transcript}>
              {transcript || "No speech detected yet..."}
            </Text>
          </View>
          
          <VoiceWaveform 
            audioLevel={audioLevel} 
            isListening={isListening}
          />
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.endButton, isListening ? styles.endButtonDisabled : {}]}
              onPress={handleEndMatch}
              disabled={isListening}
            >
              <Text style={styles.endButtonText}>End Match</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.listenButton, isListening ? styles.listenButtonActive : {}]}
              onPress={toggleListening}
            >
              {isListening ? (
                <MicOff size={24} color="white" />
              ) : (
                <Mic size={24} color="white" />
              )}
              <Text style={styles.listenButtonText}>
                {isListening ? "Stop Listening" : "Start Listening"}
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.statusText}>
            {isListening ? "Listening for score callouts..." : "Tap Start Listening to begin tracking scores"}
          </Text>
        </>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No Active Match</Text>
          <Text style={styles.emptyStateDescription}>
            Start a new match to begin tracking scores in real-time
          </Text>
          
          <TouchableOpacity
            style={styles.newMatchButton}
            onPress={() => setShowNewMatchModal(true)}
          >
            <Plus size={20} color="white" />
            <Text style={styles.newMatchButtonText}>New Match</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <NewMatchModal
        visible={showNewMatchModal}
        onClose={() => setShowNewMatchModal(false)}
        onCreateMatch={handleCreateMatch}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  transcriptContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transcriptLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  transcript: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  listenButton: {
    backgroundColor: '#1A659E',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  listenButtonActive: {
    backgroundColor: '#E53935',
  },
  listenButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    fontFamily: 'Inter-SemiBold',
  },
  endButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  endButtonDisabled: {
    opacity: 0.5,
  },
  endButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  statusText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  emptyStateDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
  },
  newMatchButton: {
    backgroundColor: '#1A659E',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  newMatchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    fontFamily: 'Inter-SemiBold',
  },
});