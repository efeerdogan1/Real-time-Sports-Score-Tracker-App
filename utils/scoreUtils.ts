import { Sport, ScoreState, GamePoint } from '../types';

// Tennis scoring sequence
const tennisScoreSequence = ['0', '15', '30', '40', 'Game'];

export function formatScore(state: ScoreState): string {
  if (state.sport === 'tennis') {
    return formatTennisScore(state);
  } else if (state.sport === 'pickleball') {
    return formatPickleballScore(state);
  }
  return '';
}

function formatTennisScore(state: ScoreState): string {
  const { teamAScore, teamBScore } = state;
  
  // Handle deuce and advantage cases
  if (teamAScore === '40' && teamBScore === '40') {
    return 'Deuce';
  }
  
  if (teamAScore === 'Advantage') {
    return 'Advantage ' + state.teamAName;
  }
  
  if (teamBScore === 'Advantage') {
    return 'Advantage ' + state.teamBName;
  }
  
  return `${teamAScore} - ${teamBScore}`;
}

function formatPickleballScore(state: ScoreState): string {
  const { teamAScore, teamBScore, teamAServing } = state;
  
  // In pickleball, the server's score is called first, then receiver's score, then the server number (1 or 2)
  if (teamAServing) {
    return `${teamAScore} - ${teamBScore} - ${getServerNumber(state)}`;
  } else {
    return `${teamBScore} - ${teamAScore} - ${getServerNumber(state)}`;
  }
}

function getServerNumber(state: ScoreState): number {
  if (state.sport !== 'pickleball') return 0;
  
  // Determine server number based on the total score
  // This is a simplified version - actual implementation would be more complex based on pickleball rules
  const totalScore = Number(state.teamAScore) + Number(state.teamBScore);
  return totalScore % 2 === 0 ? 1 : 2;
}

export function updateTennisScore(state: ScoreState, scoringTeam: 'A' | 'B'): ScoreState {
  const newState = { ...state };
  
  if (state.teamAScore === 'Advantage' && scoringTeam === 'A') {
    // Team A wins after having advantage
    return handleGameWin(state, 'A');
  } else if (state.teamBScore === 'Advantage' && scoringTeam === 'B') {
    // Team B wins after having advantage
    return handleGameWin(state, 'B');
  } else if (state.teamAScore === 'Advantage' && scoringTeam === 'B') {
    // Team B scores after Team A had advantage -> back to deuce
    newState.teamAScore = '40';
    newState.teamBScore = '40';
  } else if (state.teamBScore === 'Advantage' && scoringTeam === 'A') {
    // Team A scores after Team B had advantage -> back to deuce
    newState.teamAScore = '40';
    newState.teamBScore = '40';
  } else if (state.teamAScore === '40' && state.teamBScore === '40') {
    // Deuce -> advantage
    if (scoringTeam === 'A') {
      newState.teamAScore = 'Advantage';
    } else {
      newState.teamBScore = 'Advantage';
    }
  } else {
    // Normal scoring
    const scoreIndex = tennisScoreSequence.indexOf(
      scoringTeam === 'A' ? state.teamAScore as string : state.teamBScore as string
    );
    
    if (scoreIndex < tennisScoreSequence.length - 1) {
      if (scoringTeam === 'A') {
        newState.teamAScore = tennisScoreSequence[scoreIndex + 1];
      } else {
        newState.teamBScore = tennisScoreSequence[scoreIndex + 1];
      }
      
      // If the new score is "Game", handle the game win
      if ((scoringTeam === 'A' && newState.teamAScore === 'Game') || 
          (scoringTeam === 'B' && newState.teamBScore === 'Game')) {
        return handleGameWin(state, scoringTeam);
      }
    }
  }
  
  // Save this point to game history
  newState.gameHistory = [
    ...newState.gameHistory,
    {
      timestamp: Date.now(),
      teamAScore: newState.teamAScore,
      teamBScore: newState.teamBScore,
      teamAServing: newState.teamAServing,
      game: newState.currentGame
    }
  ];
  
  return newState;
}

export function updatePickleballScore(state: ScoreState, scoringTeam: 'A' | 'B'): ScoreState {
  const newState = { ...state };
  
  // Only the serving team can score in pickleball
  if ((scoringTeam === 'A' && state.teamAServing) || (scoringTeam === 'B' && !state.teamAServing)) {
    if (scoringTeam === 'A') {
      newState.teamAScore = Number(state.teamAScore) + 1;
    } else {
      newState.teamBScore = Number(state.teamBScore) + 1;
    }
  } else {
    // Side out - change of server
    newState.teamAServing = !state.teamAServing;
  }
  
  // Check for game win (typically to 11, win by 2)
  if (checkPickleballGameWin(newState)) {
    return handleGameWin(newState, Number(newState.teamAScore) > Number(newState.teamBScore) ? 'A' : 'B');
  }
  
  // Save this point to game history
  newState.gameHistory = [
    ...newState.gameHistory,
    {
      timestamp: Date.now(),
      teamAScore: newState.teamAScore,
      teamBScore: newState.teamBScore,
      teamAServing: newState.teamAServing,
      game: newState.currentGame
    }
  ];
  
  return newState;
}

function checkPickleballGameWin(state: ScoreState): boolean {
  const scoreA = Number(state.teamAScore);
  const scoreB = Number(state.teamBScore);
  
  // Game to 11, win by 2
  return (scoreA >= 11 && scoreA - scoreB >= 2) || (scoreB >= 11 && scoreB - scoreA >= 2);
}

function handleGameWin(state: ScoreState, winner: 'A' | 'B'): ScoreState {
  // Record the final point of the game
  const finalGameHistory = [
    ...state.gameHistory,
    {
      timestamp: Date.now(),
      teamAScore: state.teamAScore,
      teamBScore: state.teamBScore,
      teamAServing: state.teamAServing,
      game: state.currentGame
    }
  ];
  
  // Reset for new game
  return {
    ...state,
    teamAScore: state.sport === 'tennis' ? '0' : 0,
    teamBScore: state.sport === 'tennis' ? '0' : 0,
    teamAServing: state.sport === 'pickleball' ? !state.teamAServing : state.teamAServing,
    gameHistory: [],
    currentGame: state.currentGame + 1,
    isMatchPoint: false
  };
}

export function recognizeScoreFromSpeech(transcript: string, state: ScoreState): ScoreState | null {
  if (state.sport === 'tennis') {
    return recognizeTennisScore(transcript, state);
  } else if (state.sport === 'pickleball') {
    return recognizePickleballScore(transcript, state);
  }
  return null;
}

function recognizeTennisScore(transcript: string, state: ScoreState): ScoreState | null {
  // Convert to lowercase and clean up
  const text = transcript.toLowerCase();
  
  // Check for score patterns in tennis
  // This is a simplified version - a real implementation would be more sophisticated
  
  // Check for deuce
  if (text.includes('deuce')) {
    return {
      ...state,
      teamAScore: '40',
      teamBScore: '40'
    };
  }
  
  // Check for advantage
  if (text.includes('advantage')) {
    if (text.includes(state.teamAName.toLowerCase())) {
      return {
        ...state,
        teamAScore: 'Advantage',
        teamBScore: '40'
      };
    } else if (text.includes(state.teamBName.toLowerCase())) {
      return {
        ...state,
        teamAScore: '40',
        teamBScore: 'Advantage'
      };
    }
  }
  
  // Check for game point
  if (text.includes('game') && !text.includes('set') && !text.includes('match')) {
    if (text.includes(state.teamAName.toLowerCase())) {
      return updateTennisScore(state, 'A');
    } else if (text.includes(state.teamBName.toLowerCase())) {
      return updateTennisScore(state, 'B');
    }
  }
  
  // Check for regular score calls like "fifteen-thirty"
  // This would be much more complex in a real implementation
  
  return null;
}

function recognizePickleballScore(transcript: string, state: ScoreState): ScoreState | null {
  // Convert to lowercase and clean up
  const text = transcript.toLowerCase();
  
  // Try to extract the 3 numbers in pickleball scoring (e.g., "3-2-1")
  const scoreRegex = /(\d+)[^\d]+(\d+)[^\d]+(\d+)/;
  const match = text.match(scoreRegex);
  
  if (match) {
    const [_, score1, score2, serverNumber] = match;
    
    // In pickleball, the server's score is called first
    if (state.teamAServing) {
      return {
        ...state,
        teamAScore: parseInt(score1),
        teamBScore: parseInt(score2)
      };
    } else {
      return {
        ...state,
        teamAScore: parseInt(score2),
        teamBScore: parseInt(score1)
      };
    }
  }
  
  // Check for side out
  if (text.includes('side out') || text.includes('sideout')) {
    return {
      ...state,
      teamAServing: !state.teamAServing
    };
  }
  
  return null;
}