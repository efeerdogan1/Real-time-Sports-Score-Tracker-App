import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import MatchHistory from '../../components/MatchHistory';
import { useMatch } from '../../context/MatchContext';

export default function HistoryScreen() {
  const { matches, clearMatchHistory } = useMatch();

  return (
    <SafeAreaView style={styles.container}>
      <MatchHistory 
        matches={matches}
        onClearHistory={clearMatchHistory}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});