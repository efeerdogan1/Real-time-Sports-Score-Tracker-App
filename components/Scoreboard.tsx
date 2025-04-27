import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { ScoreState } from '../types';
import { formatScore } from '../utils/scoreUtils';

interface ScoreboardProps {
  scoreState: ScoreState;
  lastUpdated: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ scoreState, lastUpdated }) => {
  // Animated values for score updates
  const scoreAnim = useRef(new Animated.Value(1)).current;
  const servingAnim = useRef(new Animated.Value(1)).current;
  
  // Trigger animation when score updates
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scoreAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  }, [scoreState.teamAScore, scoreState.teamBScore, lastUpdated]);
  
  // Animation for serving indicator
  useEffect(() => {
    Animated.sequence([
      Animated.timing(servingAnim, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(servingAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, [scoreState.teamAServing]);

  const formattedScore = formatScore(scoreState);
  
  // Determine sport-specific color scheme
  const sportColors = {
    tennis: {
      primary: '#354F52',
      secondary: '#52796F',
      accent: '#84A98C'
    },
    pickleball: {
      primary: '#1A659E',
      secondary: '#0353A4',
      accent: '#053863'
    }
  };
  
  const colors = sportColors[scoreState.sport];

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.scoreboardHeader}>
        <Text style={styles.title}>{scoreState.sport.toUpperCase()} MATCH</Text>
        <Text style={styles.game}>GAME {scoreState.currentGame}</Text>
      </View>
      
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{scoreState.teamAName}</Text>
          <Animated.View 
            style={[
              styles.scoreContainer, 
              { transform: [{ scale: scoreAnim }],
                backgroundColor: colors.secondary
              }
            ]}
          >
            <Text style={styles.score}>{scoreState.teamAScore}</Text>
          </Animated.View>
          {scoreState.teamAServing && (
            <Animated.View 
              style={[
                styles.servingIndicator, 
                { transform: [{ scale: servingAnim }] }
              ]}
            />
          )}
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vs}>VS</Text>
        </View>
        
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{scoreState.teamBName}</Text>
          <Animated.View 
            style={[
              styles.scoreContainer, 
              { transform: [{ scale: scoreAnim }],
                backgroundColor: colors.secondary
              }
            ]}
          >
            <Text style={styles.score}>{scoreState.teamBScore}</Text>
          </Animated.View>
          {!scoreState.teamAServing && (
            <Animated.View 
              style={[
                styles.servingIndicator, 
                { transform: [{ scale: servingAnim }] }
              ]}
            />
          )}
        </View>
      </View>
      
      <View style={styles.calloutContainer}>
        <Text style={styles.callout}>{formattedScore}</Text>
      </View>
      
      {scoreState.isMatchPoint && (
        <View style={[styles.matchPointContainer, { backgroundColor: colors.accent }]}>
          <Text style={styles.matchPoint}>MATCH POINT</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  scoreboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  game: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 2,
  },
  teamName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreContainer: {
    backgroundColor: '#52796F',
    borderRadius: 8,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    color: 'white',
    fontSize: 40,
    fontWeight: '700',
  },
  vsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  vs: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 20,
    fontWeight: '600',
  },
  calloutContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    alignItems: 'center',
  },
  callout: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  matchPointContainer: {
    padding: 8,
    alignItems: 'center',
  },
  matchPoint: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  servingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFC107',
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default Scoreboard;