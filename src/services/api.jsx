import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const askQuestion = async (payload) => {
    const response = await api.post("/api/qna/ask", payload);
    return response.data;
};

export const synthesizeText = async (payload) => {
    const response = await api.post("/api/qna/synthesize", payload);
    return response.data;
};

export const searchLiterature = async (payload) => {
    const response = await api.post("/api/literature/search", payload);
    return response.data;
};

export const extractPdf = async (formData) => {
    const response = await api.post("/api/pdf/extract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export default api;
