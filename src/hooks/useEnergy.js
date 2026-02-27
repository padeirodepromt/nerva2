// src/hooks/useEnergy.js
// Hook para gerenciar energy check-ins, diary entries e rituals

import { useState, useCallback } from 'react';

const API_BASE = '/api/energy';

export function useEnergy() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // ENERGY CHECK-INS
  // ═══════════════════════════════════════════════════════════════════════════

  const recordEnergyCheckIn = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to record energy');
      const result = await response.json();
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTodayEnergy = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/today`);
      if (!response.ok) throw new Error('Failed to fetch today energy');
      const result = await response.json();
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeekEnergy = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/week`);
      if (!response.ok) throw new Error('Failed to fetch week energy');
      const result = await response.json();
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // DIARY ENTRIES
  // ═══════════════════════════════════════════════════════════════════════════

  const saveDiaryEntry = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/diary/entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to save diary entry');
      const result = await response.json();
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTodayDiary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/diary/today`);
      if (!response.ok) throw new Error('Failed to fetch diary');
      const result = await response.json();
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeekDiary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/diary/week`);
      if (!response.ok) throw new Error('Failed to fetch diary entries');
      const result = await response.json();
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // RITUALS
  // ═══════════════════════════════════════════════════════════════════════════

  const getRituals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/rituals`);
      if (!response.ok) throw new Error('Failed to fetch rituals');
      const result = await response.json();
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRitual = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/rituals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to create ritual');
      const result = await response.json();
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRitual = useCallback(async (ritualId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/rituals/${ritualId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to update ritual');
      const result = await response.json();
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  const getConstants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/constants`);
      if (!response.ok) throw new Error('Failed to fetch constants');
      const result = await response.json();
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    
    // Energy check-ins
    recordEnergyCheckIn,
    getTodayEnergy,
    getWeekEnergy,
    
    // Diary
    saveDiaryEntry,
    getTodayDiary,
    getWeekDiary,
    
    // Rituals
    getRituals,
    createRitual,
    updateRitual,
    
    // Constants
    getConstants
  };
}
