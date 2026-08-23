import { IStudent } from '../models/Student';
import { IRoom } from '../models/Room';
import { calculateFairness } from './fairness.engine';

export interface ScoreBreakdown {
  roomType: number;
  floor: number;
  capacity: number;
  occupancy: number;
  fairness: number;
}

export interface CandidateResult {
  room: IRoom;
  totalScore: number;
  scoreBreakdown: ScoreBreakdown;
  reason: string;
}

// Weights from Master Plan
const WEIGHTS = {
  ROOM_TYPE: 40,
  FLOOR: 25,
  CAPACITY: 20,
  OCCUPANCY: 10,
  FAIRNESS: 5,
};

export const evaluateCandidate = (student: IStudent, room: IRoom): CandidateResult => {
  // 1. Room Type (40 points max)
  const roomTypeScore = student.preferences.roomType === room.roomType ? WEIGHTS.ROOM_TYPE : 0;

  // 2. Floor (25 points max)
  let floorScore = 0;
  if (student.preferences.floor) {
    floorScore = student.preferences.floor === room.floor ? WEIGHTS.FLOOR : (WEIGHTS.FLOOR / 2); // partial score if it doesn't match
  } else {
    floorScore = WEIGHTS.FLOOR; // full score if no preference
  }

  // 3. Capacity (20 points max)
  // Higher capacity rooms get slightly higher score if multiple students needed, 
  // but let's say they all get full score if there's any capacity left.
  const capacityScore = WEIGHTS.CAPACITY;

  // 4. Occupancy (10 points max)
  // Optimize for filling partially filled rooms first
  const currentOccupants = room.occupants.length;
  let occupancyScore = 0;
  if (currentOccupants > 0 && currentOccupants < room.capacity) {
    occupancyScore = WEIGHTS.OCCUPANCY; // Optimal to fill
  } else if (currentOccupants === 0) {
    occupancyScore = WEIGHTS.OCCUPANCY / 2; // Empty room
  }

  // 5. Fairness (5 points max)
  const fairnessScore = calculateFairness(student);

  const totalScore = roomTypeScore + floorScore + capacityScore + occupancyScore + fairnessScore;

  const scoreBreakdown: ScoreBreakdown = {
    roomType: roomTypeScore,
    floor: floorScore,
    capacity: capacityScore,
    occupancy: occupancyScore,
    fairness: fairnessScore,
  };

  const reason = `Achieved a compatibility score of ${totalScore}%. ` +
    (roomTypeScore === WEIGHTS.ROOM_TYPE ? 'Room type matches. ' : '') +
    (floorScore === WEIGHTS.FLOOR ? 'Floor matches. ' : '');

  return {
    room,
    totalScore,
    scoreBreakdown,
    reason: reason.trim(),
  };
};

export const rankRooms = (student: IStudent, availableRooms: IRoom[]): CandidateResult[] => {
  const candidates: CandidateResult[] = [];
  
  for (const room of availableRooms) {
    // Hard Constraint Check
    if (room.occupants.length >= room.capacity) continue;
    
    candidates.push(evaluateCandidate(student, room));
  }

  return candidates.sort((a, b) => b.totalScore - a.totalScore);
};
