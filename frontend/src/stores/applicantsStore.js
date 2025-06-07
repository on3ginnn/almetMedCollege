import { create } from 'zustand';
import ApplicantAPI from '../api/applicantAPI';

export const useApplicantsStore = create((set) => ({
  applicants: [],
  getApplicants: async () => {
    try {
      const response = await ApplicantAPI.getApplicantList();
      set({ applicants: response.data });
    } catch (e) {
      console.error('Ошибка при загрузке списка абитуриентов:', e);
      alert('Ошибка при загрузке данных');
    }
  },
  downloadDocx: async (id, full_name) => {
    try {
      const response = await ApplicantAPI.download(id);
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      // Sanitize filename to remove invalid characters
      const safeName = full_name.replace(/[/\\?%*:|"<>]/g, '_');
      a.href = url;
      a.download = `Заявление_${safeName}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Ошибка при скачивании документа:', e);
      alert('Ошибка при скачивании документа');
    }
  },
  submitApplicant: async (data) => {
    try {
      const response = await ApplicantAPI.create(data);
      console.log('Success', response);
      return response;
    } catch (e) {
      if (e.response?.data) {
        console.error('Ошибка валидации:', e.response.data);
        alert('Ошибка: ' + JSON.stringify(e.response.data));
      } else {
        console.error('Ошибка сети:', e);
        alert('Ошибка сети');
      }
      throw e;
    }
  },
  enrollApplicant: async (id) => {
    try {
      await apiClient.patch(`/api/applicants/${id}/enroll/`, { enrolled: true });
    } catch (e) {
      console.error('Ошибка при зачислении:', e);
      throw e;
    }
  },
}));