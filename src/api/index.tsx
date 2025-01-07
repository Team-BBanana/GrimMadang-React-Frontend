import axios from "axios";
import userApi from "./user.api/user.api";
import canvasApi from "./canvas.api/canvas.api";
import familyApi from "./family.api/family.api";
import galleryApi from "./gallery.api/gallery.api";

export const CanvasClient = axios.create({
    baseURL: "http://localhost:8080/",
    withCredentials :true
});


const API = {
    userApi,
    canvasApi,
    familyApi,
    galleryApi,
};

export default API;