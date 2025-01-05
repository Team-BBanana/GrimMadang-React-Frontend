import axios from "axios";
import userApi from "./user.api/user.api";
import kidApi from "./kid.api/kid.api";
import canvasApi from "./canvas.api/canvas.api";

export const CanvasClient = axios.create({
    baseURL: "http://localhost:8080/",
    withCredentials :true
});


const API = {
    userApi,
    kidApi,
    canvasApi,
};

export default API;