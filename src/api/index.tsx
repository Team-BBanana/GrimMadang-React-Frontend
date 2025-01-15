import axios from "axios";
import userApi from "./user.api/user.api";
import canvasApi from "./canvas.api/canvas.api";
import familyApi from "./family.api/family.api";
import galleryApi from "./gallery.api/gallery.api";

export const CanvasClient = axios.create({
    baseURL: import.meta.env.VITE_CANVAS_API_URL,
    withCredentials: true
});

export const AIClient = axios.create({
    baseURL: import.meta.env.VITE_AI_API_URL,
    withCredentials: true
});

const API = {
    userApi,
    canvasApi,
    familyApi,
    galleryApi,
};

export default API;