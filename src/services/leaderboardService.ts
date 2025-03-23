import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export interface TeamScore {
  id: string;
  teamName: string;
  projectName: string;
  score: number;
  rank?: number;
}

export class LeaderboardService {
  // Get all projects and their scores for the leaderboard
  async getLeaderboardData(): Promise<TeamScore[]> {
    try {
      // In a real scenario, we would fetch this data from Firebase
      // For now, we'll use dummy data that would be structured similar to Firebase data
      
      // This is mock data to simulate fetching from Firebase
      const mockData: TeamScore[] = [
        { id: '1', teamName: 'Code Warriors', projectName: 'AI Fitness Coach', score: 95 },
        { id: '2', teamName: 'Byte Busters', projectName: 'Smart Irrigation System', score: 92 },
        { id: '3', teamName: 'Quantum Coders', projectName: 'AR Navigation App', score: 89 },
        { id: '4', teamName: 'Digital Nomads', projectName: 'Sustainability Tracker', score: 85 },
        { id: '5', teamName: 'Tech Titans', projectName: 'Mental Health Bot', score: 83 },
        { id: '6', teamName: 'Algorithm Aces', projectName: 'Blockchain Voting', score: 81 },
        { id: '7', teamName: 'Neural Ninjas', projectName: 'Pollution Monitor', score: 78 },
        { id: '8', teamName: 'Pixel Pirates', projectName: 'Virtual Reality Museum', score: 75 },
        { id: '9', teamName: 'Data Demons', projectName: 'Stock Market Predictor', score: 72 },
        { id: '10', teamName: 'Binary Bandits', projectName: 'Audio Transcription Tool', score: 70 },
      ];
      
      // Sort teams by score in descending order and assign ranks
      return mockData
        .sort((a, b) => b.score - a.score)
        .map((team, index) => ({
          ...team,
          rank: index + 1
        }));
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      return [];
    }
  }

  // In a real implementation, this would calculate scores from raw ratings data
  async calculateTeamScores(): Promise<Record<string, number>> {
    try {
      // This would typically fetch raw ratings from Firebase and calculate overall scores
      // For now, we'll return a mock calculation result
      return {
        '1': 95,
        '2': 92,
        '3': 89,
        '4': 85,
        '5': 83,
        '6': 81,
        '7': 78,
        '8': 75,
        '9': 72,
        '10': 70,
      };
    } catch (error) {
      console.error('Error calculating team scores:', error);
      return {};
    }
  }

  // This would be used to update the leaderboard in real-time as judges submit scores
  async refreshLeaderboard(): Promise<TeamScore[]> {
    // Calculate the latest scores
    const scores = await this.calculateTeamScores();
    
    // Get the updated leaderboard data
    return this.getLeaderboardData();
  }
} 