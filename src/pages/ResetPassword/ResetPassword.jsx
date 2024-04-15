import * as React from "react";
import axios from 'axios';

import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"

import './ResetPassword.css'
import validator from "validator";
import { useNavigate } from "react-router-dom";

function Reset_password() {

    const  [OTPInfo, setOTPInfo] = React.useState({email:"",OTP:""});
    const [errors1, setErrors1] = React.useState([]);
    const [errors2, setErrors2] = React.useState([]);
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
        console.log(OTPInfo)
;
        if (!validator.isEmail(OTPInfo.email)) {
            setErrors1("Email không đúng định dạng");
            return;
        }
        else{
            axios.post(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/account/reset-password/request`, {
                email: OTPInfo.email,
            })
            .then(function (response) {
                console.log(response)
                if (response.data.status === 1 || response.data.status === 7) {
                    setRequested(true);
                } else {
                    setErrors1("Yêu cầu reset mật khẩu thất bại");
                }
            })
            .catch(function (error) {
                setErrors1(error.message);
            });
        }
    }

    const handleSubmitOTP = () =>{
        if (!OTPInfo.OTP) {
            setErrors2("OTP không được để trống");
            return;
        }
        else{
            axios.post(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/account/reset-password`, {
                email: OTPInfo.email,
                otp: OTPInfo.OTP,
            })
            .then(function (response) {
                console.log(response);
                if (response.data.status === 1) {
                    navigate('/');
                } else {
                    setErrors2("Xác nhận OTP thất bại");
                }
            })
            .catch(function (error) {
                setErrors2(error.message);
            });
        }
    }
    return (
        <div className="Reset_password__wrapper">
            <img src="/assets/images/poster_login.png" alt="poster" className="Reset_password__poster" />
            <div className='Reset_password'>
                <img src="/assets/images/logo.png" alt="logo" className="Reset_password__logo" />
                {!requested && <form onSubmit={(e) => { e.preventDefault(); handleSubmitRequest(); }} className='Reset_password__form'>
                    <label htmlFor="email" className='form__label'>Email</label>
                    <input 
                        type="text" 
                        id="email" 
                        name="email"
                        value={OTPInfo.email}
                        onChange={handleChange}
                        placeholder='Nhập email cần reset mật khẩu' 
                        className='form__input' />
                    { errors1 && <span className="error">{errors1}</span>}
                    <button className='Reset_password__form--submit_btn' type="submit">Gửi yêu cầu</button>
                </form>
                }
                {requested && <form onSubmit={(e) => { e.preventDefault(); handleSubmitOTP(); }} className='Reset_password__form'>
                    <label htmlFor="OTP" className='form__label'>OTP</label>
                    <input 
                        type="OTP" 
                        id="OTP" 
                        name="OTP"
                        value={OTPInfo.OTP}
                        onChange={handleChange}
                        placeholder='Nhập OTP' 
                        className='form__input'/>
                    { errors2 && <span className="error">{errors2}</span>}
                    <button className='Reset_password__form--submit_btn' type="submit">Xác nhận</button>
                </form>
                }
            </div>
        </div>
    );
}

export default Reset_password;
