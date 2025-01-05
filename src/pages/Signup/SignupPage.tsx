import SignupComponent from "./component/SignupComponent";
import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "@/api";

interface SignupFormData {
    name: string;
    phoneNumber: string;
}


const SignupPage = () => {

    const [error, setError] = useState<string| null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();


    const handleSubmit = async (formData: SignupFormData) => {
        console.log(formData);
        try {
            const result = await API.userApi.signupUser({
                name: formData.name,
                phoneNumber: formData.phoneNumber,
            });
            if ( result.status == 201){
                setSuccess('회원가입이 완료되었습니다!');
                setError(null);
                navigate('/login');
                return;
            }
            if (typeof result.data === 'object' && result.data !== null && 'body' in result.data) {
                setError((result.data as {body: string}).body);
            }

        } catch (err) {
            console.log(err);
            if (axios.isAxiosError(err) && err.response) {
                const data = err.response.data.errors;
                const errors: string[] = [];

                if (data.name) {
                    errors.push(data.name);
                }
                if (data.phoneNumber) {
                    errors.push(data.phoneNumber);
                }


                setError(errors.join('\n'));
            } else {
                setError('회원가입에 실패했습니다. 다시 시도해주세요.');
            }
            setSuccess(null);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <SignupComponent errormsg = {error} success = {success} onClickSubmit={handleSubmit} />
            </div>
        </div>
    )

}

export default SignupPage;