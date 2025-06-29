import { create } from 'zustand';
import ApplicantAPI from '../api/applicantAPI';

export const useApplicantsStore = create((set, get) => ({
  applicants: [],
  selectedApplicant: null,
  rating: [],
  getApplicants: async () => {
    try {
      const response = await ApplicantAPI.getApplicantList();
      set({ applicants: response.data });
    } catch (e) {
      console.error('Ошибка при загрузке списка абитуриентов:', e);
      alert('Ошибка при загрузке данных');
    }
  },
  getApplicantById: async (id) => {
    try {
      const response = await ApplicantAPI.get(id);
      set({ selectedApplicant: response.data });
    } catch (error) {
      set({ error: 'Ошибка при загрузке данных абитуриента', loading: false });
    }
  },
  deleteApplicantById: async (id) => {
    try {
      const response = await ApplicantAPI.delete(id);
      set({ selectedApplicant: null });
    } catch (error) {
      set({ error: 'Ошибка при удалении данных абитуриента', loading: false });
    }
  },
  downloadDocx: async (id, full_name) => {
    try {
      const response = await ApplicantAPI.download(id);
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
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
  downloadTitul: async (id, full_name) => {
    try {
      const response = await ApplicantAPI.downloadTitul(id);
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = full_name.replace(/[/\\?%*:|"<>]/g, '_');
      a.href = url;
      a.download = `Титульник_${safeName}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Ошибка при скачивании титульника:', e);
      alert('Ошибка при скачивании титульника');
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
      await ApplicantAPI.enroll(id);
      await get().getApplicants(); // Refresh table
    } catch (e) {
      console.error('Ошибка при зачислении:', e);
      throw e;
    }
  },
  updateDocumentsSubmitted: async (id, value) => {
    try {
      await ApplicantAPI.updateDocumentsSubmitted(id, value);
      await get().getApplicants(); // Refresh table
    } catch (e) {
      console.error('Ошибка при обновлении типа документов:', e);
      throw e;
    }
  },
  updateDocumentsStatus: async (id, delivered) => {
    try {
      await ApplicantAPI.updateDocumentsStatus(id, delivered);
      await get().getApplicants(); // Refresh table
    } catch (e) {
      console.error('Ошибка при обновлении статуса документов:', e);
      throw e;
    }
  },
  updateAdmissionType: async (id, value) => {
    try {
      await ApplicantAPI.updateAdmissionType(id, value);
      await get().getApplicants(); // Refresh table
    } catch (e) {
      console.error('Ошибка при обновлении типа поступления:', e);
      throw e;
    }
  },
  downloadExcel: async () => {
    try {
      const response = await ApplicantAPI.downloadExcel();
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'applicants_delivered.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Ошибка при скачивании Excel:', e);
      throw e;
    }
  },
  fetchRating: async (specialty, type) => {
    try {
      const response = await ApplicantAPI.getRating(specialty, type);
      set({ rating: response.data });
    } catch (e) {
      console.error("Ошибка при загрузке рейтинга:", e);
    }
  },
  updateApplicant: async (id, data) => {
    try {
      const response = await ApplicantAPI.update(id, data);
      return response;
    } catch (e) {
      console.error('Ошибка при обновлении анкеты:', e);
      throw e;
    }
  },
  updateNumber: async (id, number) => {
    try {
      const response = await ApplicantAPI.updateNumber(id, number);
      return response;
    } catch (e) {
      console.error('Ошибка при обновлении анкеты:', e);
      throw e;
    }
  },
}));