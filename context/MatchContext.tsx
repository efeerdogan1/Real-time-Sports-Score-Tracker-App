import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Match, ScoreState, Sport } from '../types';
import { v4 as uuidv4 } from 'uuid';

type MatchContextType = {
  currentMatch: ScoreState | null;
  matches: Match[];
  startNewMatch: (sport: Sport, teamAName: string, teamBName: string) => void;
  updateMatch: (newState: Partial<ScoreState>) => void;
  endMatch: () => void;
  clearMatchHistory: () => void;
};

const MatchContext = createContext<MatchContextType>({
  currentMatch: null,
  matches: [],
  startNewMatch: () => {},
  updateMatch: () => {},
  endMatch: () => {},
  clearMatchHistory: () => {}
});

export const useMatch = () => useContext(MatchContext);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMatch, setCurrentMatch] = useState<ScoreState | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load match history from storage
  useEffect(() => {
    const loadMatches = async () => {
      try {
        const storedMatches = await AsyncStorage.getItem('matchHistory');
        if (storedMatches) {
          setMatches(JSON.parse(storedMatches));
        }

        const storedCurrentMatch = await AsyncStorage.getItem('currentMatch');
        if (storedCurrentMatch) {
          setCurrentMatch(JSON.parse(storedCurrentMatch));
        }
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadMatches();
  }, []);

  // Save match history to storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      const saveData = async () => {
        try {
          await AsyncStorage.setItem('matchHistory', JSON.stringify(matches));
          
          if (currentMatch) {
            await AsyncStorage.setItem('currentMatch', JSON.stringify(currentMatch));
          } else {
            await AsyncStorage.removeItem('currentMatch');
          }
        } catch (error) {
          console.error('Failed to save match data:', error);
        }
      };

      saveData();
    }
  }, [matches, currentMatch, isLoaded]);

  const startNewMatch = (sport: Sport, teamAName: string, teamBName: string) => {
    // If there's an ongoing match, save it first
    if (currentMatch) {
      endMatch();
    }

    // Initialize a new match with default scores
    const newMatch: ScoreState = {
      sport,
      teamAScore: sport === 'tennis' ? '0' : 0,
      teamBScore: sport === 'tennis' ? '0' : 0,
      teamAName,
      teamBName,
      teamAServing: true,
      gameHistory: [],
      currentGame: 1,
      isMatchPoint: false
    };

    setCurrentMatch(newMatch);
  };

  const updateMatch = (newState: Partial<ScoreState>) => {
    if (currentMatch) {
      setCurrentMatch(prev => ({
        ...prev!,
        ...newState
      }));
    }
  };

  const endMatch = () => {
    if (currentMatch) {
      // Create a completed match record
      const completedMatch: Match = {
        id: uuidv4(),
        sport: currentMatch.sport,
        date: new Date().toISOString(),
        teamAName: currentMatch.teamAName,
        teamBName: currentMatch.teamBName,
        teamAFinalScore: currentMatch.teamAScore,
        teamBFinalScore: currentMatch.teamBScore,
        games: [currentMatch.gameHistory], // This would be more complex with multiple games
        winner: determineWinner(currentMatch)
      };

      // Add to match history
      setMatches(prev => [completedMatch, ...prev]);
      
      // Clear current match
      setCurrentMatch(null);
    }
  };

  const determineWinner = (state: ScoreState): 'A' | 'B' | null => {
    // This is a simplified version - actual implementation would depend on sport-specific rules
    if (state.sport === 'tennis') {
      // For tennis, need to look at sets
      return null; // Placeholder
    } else if (state.sport === 'pickleball') {
      // For pickleball, typically who has more points in the final game
      const scoreA = Number(state.teamAScore);
      const scoreB = Number(state.teamBScore);
      
      if (scoreA > scoreB) return 'A';
      if (scoreB > scoreA) return 'B';
    }
    
    return null;
  };

  const clearMatchHistory = () => {
    setMatches([]);
  };

  return (
    <MatchContext.Provider 
      value={{ 
        currentMatch, 
        matches, 
        startNewMatch, 
        updateMatch, 
        endMatch,
        clearMatchHistory
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};