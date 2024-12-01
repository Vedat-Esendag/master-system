import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_DESK_API_KEY || '';
const BASE_URL = ''; // Use relative paths

export interface DeskState {
  position_mm: number;
  speed_mms: number;
  status: string;
  isPositionLost: boolean;
  isOverloadProtectionUp: boolean;
  isOverloadProtectionDown: boolean;
  isAntiCollision: boolean;
}

export interface DeskConfig {
  name: string;
  manufacturer: string;
}

export interface DeskUsage {
  activationsCounter: number;
  sitStandCounter: number;
}

export interface DeskError {
  time_s: number;
  errorCode: number;
}

export interface DeskData {
  config: DeskConfig;
  state: DeskState;
  usage: DeskUsage;
  lastErrors: DeskError[];
}

class DeskAPI {
  private apiUrl: string;

  constructor() {
    this.apiUrl = `/api/v2/${API_KEY}/desks`;
  }

  async getAllDesks(): Promise<string[]> {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching desks:', error);
      throw error;
    }
  }

  async getDeskData(deskId: string): Promise<DeskData> {
    try {
      const response = await axios.get(`${this.apiUrl}/${deskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching desk ${deskId}:`, error);
      throw error;
    }
  }

  async updateDeskPosition(deskId: string, position_mm: number): Promise<{ position_mm: number }> {
    try {
      const response = await axios.put(`${this.apiUrl}/${deskId}/state`, {
        position_mm
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating desk ${deskId} position:`, error);
      throw error;
    }
  }
}

export const deskAPI = new DeskAPI();
