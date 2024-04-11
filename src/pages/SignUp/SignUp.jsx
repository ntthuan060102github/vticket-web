import * as React from "react";
import { Link } from "react-router-dom";

import './SignUp.css'

function SignUp() {
    return (
        <div className="SignUp__wrapper">
            <img src="/assets/images/poster_login.png" alt="poster" className="SignUp__poster" />
            <div className='SignUp'>
                <img src="/assets/images/logo.png" alt="logo" className="SignUp__logo" />
                <div className="SignUp__nav">
                    <Link to={'/SignUp'} className="SignUp__nav--signin_btn">Đăng nhập</Link>
                    <Link to={'/signup'} className="SignUp__nav--signup_btn active">Đăng ký</Link>
                </div>
                <form action="submit" className='SignUp__form'>
                    <label htmlFor="username" className='form__label'>Họ và Tên</label>
                    <input type="text" id="username" placeholder='Nhập tên người dùng' className='form__input' />
                    <label htmlFor="email" className='form__label'>Email</label>
                    <input type="text" id="email" placeholder='Nhập email' className='form__input' />
                    <label htmlFor="password" className='form__label'>Mật khẩu</label>
                    <input type="text" id="password" placeholder='Nhập mật khẩu' className='form__input' />
                    <label htmlFor="re_enter_password" className='form__label'>Nhập lại mật khẩu</label>
                    <input type="text" id="re_enter_password" placeholder='Nhập lại mật khẩu' className='form__input' />
                    <Link to={'/forgot_password'} className="SignUp__form--forgot">Bạn đã có tài khoản? <b>Đăng nhập</b></Link>
                    <button className='SignUp__form--submit_btn'>Đăng ký</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;