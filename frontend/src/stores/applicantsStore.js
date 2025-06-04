// src/stores/applicantsStore.js
import { create } from 'zustand';
import axios from 'axios';

export const useApplicantsStore = create((set) => ({
  applicants: [],
  getApplicants: async () => {
    try {
      const { data } = await axios.get('/api/applicants/');
      set({ applicants: data });
    } catch (e) {
      console.error(e);
    }
  },
  submitApplicant: async (payload) => {
    await axios.post('/api/applicants/', payload);
  },
  enrollApplicant: async (id) => {
    await axios.patch(`/api/applicants/${id}/enroll/`, { enrolled: true });
  },
}));
