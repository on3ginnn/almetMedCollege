import { apiClient } from "../config/APIClient";

export default class GroupAPI {
    static async getGroupList() {
        try {
            const response = await apiClient.get(`/group/all/`);
            return response;
        } catch (error) {
            console.error(error);
        }
    }
}