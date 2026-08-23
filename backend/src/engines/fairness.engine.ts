import { IStudent } from '../models/Student';

/**
 * Calculates a fairness score (0-5) based on student history or other metrics.
 * Currently a deterministic placeholder that returns full points.
 */
export const calculateFairness = (student: IStudent): number => {
  // In a real implementation, we could look at:
  // - Previous allocation history
  // - Number of allocation attempts
  // - Disciplinary or specific priority criteria

  // For the hackathon, we return the max fairness score (5) 
  // unless we have specific conditions to penalize.
  let fairnessScore = 5;
  
  // Example condition: If they already have an allocation, lower their fairness 
  // score for a new room request.
  if (student.allocation?.roomNo) {
    fairnessScore -= 2;
  }

  return Math.max(0, Math.min(fairnessScore, 5));
};
