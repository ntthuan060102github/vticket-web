import * as React from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from 'axios';

import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"

import './Login.css'
import validator from "validator";

function Login() {

    const  [accountInfo, setAccountInfo] = React.useState({username:"",password:""});
    const [errors, setErrors] = React.useState([]);
    const navigate = useNavigate();


    const handleChange = (event) =>{
        let value = event.target.value;
        let name = event.target.name;
 
        setAccountInfo((prevalue) => {
            return {
                ...prevalue,                
                [name]: value
            }
        })
    }

    const handleSubmit = () =>{
        const newErrors = {};

        if (!validator.isEmail(accountInfo.username)) {
            newErrors["email"] = "Email không đúng định dạng";
        }

        if (!accountInfo.password) {
            newErrors["password"] = "Mật khẩu không được để trống";
        };

        if (Object.keys(newErrors).length !== 0) {
            setErrors(newErrors);
            return;
        }else{
            axios.post(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/token`, {
                email: accountInfo.username,
                password: accountInfo.password,
            })
            .then(function (response) {
                if (response.data.status === 1) {
                    navigate('/');
                    localStorage.setItem('access', response.data.data.access);
                    localStorage.setItem('refresh', response.data.data.refresh);
                    localStorage.setItem("id", response.data.data.profile.id);
                    localStorage.setItem("email", response.data.data.profile.email);
                    localStorage.setItem("first_name", response.data.data.profile.first_name);
                    localStorage.setItem("last_name", response.data.data.profile.last_name);
                    localStorage.setItem("gender", response.data.data.profile.gender);
                    localStorage.setItem("birthday", response.data.data.profile.birthday);
                    localStorage.setItem("avatar_url", response.data.data.profile.avatar_url);
                    localStorage.setItem("phone_number", response.data.data.profile.phone_number);
                    localStorage.setItem("status", response.data.data.profile.status);
                    localStorage.setItem("role", response.data.data.profile.role);
                } else {
                    newErrors["login"] = response.data.message;
                    setErrors(newErrors);
                }
            })
            .catch(function (error) {
                newErrors["error"] = error.message;
                setErrors(newErrors);
            });
        }
    }
    return (
        <div className="Login__wrapper">
            <img src="/assets/images/poster_login.png" alt="poster" className="Login__poster" />
            <div className='Login'>
                <img src="/assets/images/logo.png" alt="logo" className="Login__logo" />
                <div className="Login__nav">
                    <Link to={'/login'} className="Login__nav--signin_btn active">Đăng nhập</Link>
                    <Link to={'/sign-up'} className="Login__nav--signup_btn">Đăng ký</Link>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='Login__form'>
                    <label htmlFor="username" className='Login_form__label'>Tài khoản</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username"
                        value={accountInfo.username}
                        onChange={handleChange}
                        placeholder='Nhập tài khoản' 
                        className={errors.email ? "Login_form__input error-input" : "Login_form__input normal-input"}
                    />
                    {errors["email"] && <span className="error">{errors["email"]}</span>}
                    <label htmlFor="password" className='Login_form__label'>Mật khẩu</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        value={accountInfo.password}
                        onChange={handleChange}
                        placeholder='Nhập mật khẩu' 
                        className={errors.password ? "Login_form__input error-input" : "Login_form__input normal-input"}
                    />
                    {errors["password"] && <span className="error">{errors["password"]}</span>}
                    <Link to={'/reset-password'} className="Login__form--reset">Bạn không nhớ mật khẩu?</Link>
                    {errors["login"] && <span className="error">{errors["login"]}</span>}
                    {errors["error"] && <span className="error">{errors["error"]}</span>}
                    <button className='Login__form--submit_btn' type="submit">Đăng nhập</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
