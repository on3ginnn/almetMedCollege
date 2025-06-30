import { apiClient } from "../config/APIClient";

export default class ApplicantAPI {
    static async create(data) {
        try {
            const response = await apiClient.post('/applicants/', data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async getApplicantList() {
        try {
            const response = await apiClient.get('/applicants/');
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async get(pk) {
        try {
            const response = await apiClient.get(`/applicants/${pk}/`);
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async delete(pk) {
        try {
            const response = await apiClient.delete(`/applicants/${pk}/`);
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async download(pk) {
        try {
            const response = await apiClient.get(`/applicants/${pk}/download/`, {
                responseType: 'blob',
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async downloadTitul(pk) {
        try {
            const response = await apiClient.get(`/applicants/${pk}/download/titul/`, {
                responseType: 'blob',
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async enroll(pk) {
        try {
            const response = await apiClient.patch(`/applicants/${pk}/enroll/`, { enrolled: true });
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async updateDocumentsSubmitted(pk, value) {
        try {
            const response = await apiClient.patch(`/applicants/${pk}/document/`, {
                documents_submitted: value,
            });
            console.log(response.status)
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async updateStudyForm(pk, value) {
        try {
            const response = await apiClient.patch(`/applicants/${pk}/study_form/`, {
                study_form: value,
            });
            console.log(response.status)
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async updateDocumentsStatus(pk, delivered) {
        try {
            const response = await apiClient.patch(`/applicants/${pk}/update_documents_delivered/`, {
                documents_delivered: delivered,
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async updateAdmissionType(pk, value) {
        try {
            const response = await apiClient.patch(`/applicants/${pk}/admission_type/`, {
                admission_type: value,
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async downloadExcel() {
        try {
            const response = await apiClient.get('/applicants/download_excel/', {
                responseType: 'blob',
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async getRating(specialty, type) {
        const response = await apiClient.get(`/applicants/rating/`, {
            params: { specialty, admission_type: type },
        });
        return response;
    }
    static async update(pk, data) {
        try {
            console.log(data);
            const response = await apiClient.patch(`/applicants/${pk}/`, data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async updateNumber(pk, number) {
        try {
            const response = await apiClient.patch(`/applicants/${pk}/number/`, {
                registration_number: number,
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
}