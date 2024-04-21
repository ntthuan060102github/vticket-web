import * as React from "react";
import axios from 'axios';

import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"

import './ResetPassword.css'
import validator from "validator";
import { useNavigate } from "react-router-dom";

function Reset_password() {

    const  [OTPInfo, setOTPInfo] = React.useState({email:"",OTP:""});
    const [errors, setErrors] = React.useState([]);
    const navigate = useNavigate();

    const [requested, setRequested] = React.useState(false);

    const handleChange = (event) =>{
        let value = event.target.value;
        let name = event.target.name;
 
        setOTPInfo((prevalue) => {
            return {
                ...prevalue,             
                [name]: value
            }
        })
    }

    const handleSubmitRequest = () =>{
        const newErrors = {};
        
        if (!validator.isEmail(OTPInfo.email)) {
            newErrors["email"] = "Email không đúng định dạng";
            setErrors(newErrors);
            return;
        }
        else{
            axios.post(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/account/reset-password/request`, {
                email: OTPInfo.email,
            })
            .then(function (response) {
                if (response.data.status === 1 || response.data.status === 7) {
                    setRequested(true);
                } else {
                    newErrors["error_req"] = response.data.message;
                    setErrors(newErrors);
                }
            })
            .catch(function (error) {
                newErrors["error_email"] = error.message;
                setErrors(newErrors);
            });
        }
    }

    const handleSubmitOTP = () =>{
        const newErrors = {};
        if (!OTPInfo.OTP) {
            newErrors["otp"] = "OTP không được để trống";
            setErrors(newErrors);
            return;
        }
        else{
            axios.post(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/account/reset-password`, {
                email: OTPInfo.email,
                otp: OTPInfo.OTP,
            })
            .then(function (response) {
                
                if (response.data.status === 1) {
                    navigate('/');
                } else {
                    newErrors["error_res"] = response.data.message;
                    setErrors(newErrors);
                }
            })
            .catch(function (error) {
                newErrors["error_otp"] = error.message;
                setErrors(newErrors);
            });
        }
    }
    return (
        <div className="Reset_password__wrapper">
            <img src="/assets/images/poster_login.png" alt="poster" className="Reset_password__poster" />
            <div className='Reset_password'>
                <img src="/assets/images/logo.png" alt="logo" className="Reset_password__logo" />
                {!requested && <form onSubmit={(e) => { e.preventDefault(); handleSubmitRequest(); }} className='Reset_password__form'>
                    <label htmlFor="email" className='reset_password_form__label'>Email</label>
                    <input 
                        type="text" 
                        id="email" 
                        name="email"
                        value={OTPInfo.email}
                        onChange={handleChange}
                        placeholder='Nhập email cần đặt lại mật khẩu' 
                        className={errors["email"] ? "reset_password_form__input error-input" : "reset_password_form__input normal-input"}
                    />
                    { errors["email"] && <span className="error">{errors["email"]}</span>}
                    { errors["error_req"] && <span className="error">{errors["error_req"]}</span>}
                    { errors["error_email"] && <span className="error">{errors["error_email"]}</span>}
                    <button className='Reset_password__form--submit_btn' type="submit">Gửi yêu cầu</button>
                </form>
                }
                {requested && <form onSubmit={(e) => { e.preventDefault(); handleSubmitOTP(); }} className='Reset_password__form'>
                    <label htmlFor="OTP" className='reset_password_form__label'>OTP</label>
                    <input 
                        type="OTP" 
                        id="OTP" 
                        name="OTP"
                        value={OTPInfo.OTP}
                        onChange={handleChange}
                        placeholder='Nhập OTP đã được gửi về email' 
                        className={errors["otp"] ? "reset_password_form__input error-input" : "reset_password_form__input normal-input"}
                    />
                    { errors["otp"] && <span className="error">{errors["otp"]}</span>}
                    { errors["error_req"] && <span className="error">{errors["error_req"]}</span>}
                    { errors["error_otp"] && <span className="error">{errors["error_otp"]}</span>}
                    <button className='Reset_password__form--submit_btn' type="submit">Xác nhận</button>
                </form>
                }
            </div>
        </div>
    );
}

export default Reset_password;
