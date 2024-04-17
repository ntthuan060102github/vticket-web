import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";

import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import './OTP.css'
import axios from "axios";

function OTP() {
    let { slug } = useParams();
    const  [OTPInfo, setOTPInfo] = React.useState({email:slug,OTP:""});
    const [errors, setErrors] = React.useState([]);
    const navigate = useNavigate();

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

    const handleSubmit = () =>{
        const newError = {};
        if (!OTPInfo.OTP) {
            newError["otp"] = "OTP không được để trống";
            setErrors(newError);
            return;
        }
        else{
            axios.post(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/account/verification`, {
                email: OTPInfo.email,
                otp: OTPInfo.OTP,
            })
            .then(function (response) {
                if (response.data.status === 1) {
                    navigate('/');
                } else {
                    newError["error_res"] = response.data.message;
                    setErrors(newError);
                }
            })
            .catch(function (error) {
                newError["error"] = error.message;
                setErrors(newError);
            });
        }
    }
    return (
        <div className="OTP__wrapper">
            <img src="/assets/images/poster_login.png" alt="poster" className="OTP__poster" />
            <div className='OTP'>
                <img src="/assets/images/logo.png" alt="logo" className="OTP__logo" />
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='OTP__form'>
                    <label htmlFor="OTP" className='otp_form__label'>OTP</label>
                    <input 
                        type="text" 
                        id="OTP" 
                        name='OTP' 
                        placeholder='Nhập mã OTP' 
                        onChange={handleChange} 
                        className={errors["otp"] ? "otp_form__input error-input" : "otp_form__input normal-input"}
                    />
                    {/* <span className="OTP__form--resend">Chưa nhận được mã? <b>Gửi lại mã</b></span> */}
                    { errors["otp"] && <span className="error">{errors["otp"]}</span>}
                    { errors["error_res"] && <span className="error">{errors["error_res"]}</span>}
                    { errors["error"] && <span className="error">{errors["error"]}</span>}
                    <button type="submit" className='OTP__form--submit_btn'>Xác nhận</button>
                </form>
            </div>
        </div>
    );
}

export default OTP;