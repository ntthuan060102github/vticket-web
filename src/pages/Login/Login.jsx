import * as React from "react";
import { Link } from "react-router-dom";

import './Login.css'

function Login() {
    return (
        <div className="Login__wrapper">
            <img src="/assets/images/poster_login.png" alt="poster" className="Login__poster" />
            <div className='Login'>
                <img src="/assets/images/logo.png" alt="logo" className="Login__logo" />
                <div className="Login__nav">
                    <Link to={'/login'} className="Login__nav--signin_btn active">Đăng nhập</Link>
                    <Link to={'/signup'} className="Login__nav--signup_btn">Đăng ký</Link>
                </div>
                <form action="submit" className='Login__form'>
                    <label htmlFor="username" className='form__label'>Tài khoản</label>
                    <input type="text" id="username" placeholder='Nhập tài khoản' className='form__input' />
                    <label htmlFor="password" className='form__label'>Mật khẩu</label>
                    <input type="text" id="password" placeholder='Nhập mật khẩu' className='form__input' />
                    <Link to={'/forgot_password'} className="Login__form--forgot">Quên mật khẩu?</Link>
                    <button className='Login__form--submit_btn'>Đăng nhập</button>
                </form>
            </div>
        </div>
    );
}

export default Login;