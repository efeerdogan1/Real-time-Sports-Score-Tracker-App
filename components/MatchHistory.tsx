import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Match } from '../types';
import { Calendar, ChevronRight } from 'lucide-react-native';

interface MatchHistoryProps {
  matches: Match[];
  onClearHistory: () => void;
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ matches, onClearHistory }) => {
  if (matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Calendar size={48} color="#999" />
        <Text style={styles.emptyText}>No match history yet</Text>
        <Text style={styles.emptySubtext}>
          Your completed matches will appear here
        </Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderItem = ({ item }: { item: Match }) => (
    <TouchableOpacity style={styles.matchItem}>
      <View style={styles.matchHeader}>
        <Text style={styles.sport}>{item.sport.toUpperCase()}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
      
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{item.teamAName}</Text>
          <Text style={[
            styles.score,
            item.winner === 'A' && styles.winnerScore
          ]}>
            {item.teamAFinalScore}
          </Text>
          {item.winner === 'A' && <Text style={styles.winnerLabel}>WINNER</Text>}
        </View>
        
        <Text style={styles.vs}>vs</Text>
        
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{item.teamBName}</Text>
          <Text style={[
            styles.score,
            item.winner === 'B' && styles.winnerScore
          ]}>
            {item.teamBFinalScore}
          </Text>
          {item.winner === 'B' && <Text style={styles.winnerLabel}>WINNER</Text>}
        </View>
      </View>
      
      <ChevronRight size={20} color="#999" style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Match History</Text>
        {matches.length > 0 && (
          <TouchableOpacity onPress={onClearHistory}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={matches}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  clearButton: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 16,
  },
  matchItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sport: {
    color: '#1A659E',
    fontWeight: '700',
    fontSize: 14,
  },
  date: {
    color: '#777',
    fontSize: 14,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    flex: 2,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  score: {
    fontSize: 24,
    fontWeight: '700',
  },
  winnerScore: {
    color: '#4CAF50',
  },
  winnerLabel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '700',
    marginTop: 4,
  },
  vs: {
    flex: 1,
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
  },
  chevron: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#555',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default MatchHistory;