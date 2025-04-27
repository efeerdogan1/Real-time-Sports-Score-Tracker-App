import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Sport } from '../types';
import { Tent as Tennis, Brackets as Racquet } from 'lucide-react-native';

interface NewMatchModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateMatch: (sport: Sport, teamAName: string, teamBName: string) => void;
}

const NewMatchModal: React.FC<NewMatchModalProps> = ({ visible, onClose, onCreateMatch }) => {
  const [sport, setSport] = useState<Sport>('tennis');
  const [teamAName, setTeamAName] = useState('Team A');
  const [teamBName, setTeamBName] = useState('Team B');

  const handleSubmit = () => {
    onCreateMatch(sport, teamAName || 'Team A', teamBName || 'Team B');
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSport('tennis');
    setTeamAName('Team A');
    setTeamBName('Team B');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>New Match</Text>
              
              <View style={styles.sportSelector}>
                <Text style={styles.label}>Select Sport</Text>
                <View style={styles.sportOptions}>
                  <TouchableOpacity
                    style={[
                      styles.sportOption,
                      sport === 'tennis' && styles.selectedSport
                    ]}
                    onPress={() => setSport('tennis')}
                  >
                    <Tennis 
                      size={28} 
                      color={sport === 'tennis' ? 'white' : '#333'} 
                    />
                    <Text style={[
                      styles.sportText,
                      sport === 'tennis' && styles.selectedSportText
                    ]}>Tennis</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.sportOption,
                      sport === 'pickleball' && styles.selectedSport
                    ]}
                    onPress={() => setSport('pickleball')}
                  >
                    <Racquet 
                      size={28} 
                      color={sport === 'pickleball' ? 'white' : '#333'} 
                    />
                    <Text style={[
                      styles.sportText,
                      sport === 'pickleball' && styles.selectedSportText
                    ]}>Pickleball</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Team 1 Name</Text>
                <TextInput
                  style={styles.input}
                  value={teamAName}
                  onChangeText={setTeamAName}
                  placeholder="Team 1"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Team 2 Name</Text>
                <TextInput
                  style={styles.input}
                  value={teamBName}
                  onChangeText={setTeamBName}
                  placeholder="Team 2"
                />
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleSubmit}
                >
                  <Text style={[styles.buttonText, styles.submitButtonText]}>
                    Start Match
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  sportSelector: {
    marginBottom: 20,
  },
  sportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sportOption: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSport: {
    backgroundColor: '#1A659E',
    borderColor: '#1A659E',
  },
  sportText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedSportText: {
    color: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  submitButton: {
    backgroundColor: '#1A659E',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
  },
});

export default NewMatchModal;