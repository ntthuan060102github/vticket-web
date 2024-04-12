import * as React from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import './SignUp.css'

function SignUp() {
    

    const  [accountInfo, setAccountInfo] = React.useState({
        email: "",
        first_name: "",
        last_name: "",
        gender: 1,
        birthday: "",
        password: "",
        role: ""
    });

    

    const [error, setError] = React.useState("");

    const handleChange = (event) =>{
        let value = event.target.value;
        let name = event.target.name;
 
        setAccountInfo((prevalue) => {
            return {
                ...prevalue,   // Spread Operator               
                [name]: value
            }
        })
    }

    const handleDateChange = (date) => {
        const formattedDate = date.format("YYYY-MM-DD");
        setAccountInfo((prevValue) => ({
            ...prevValue,
            birthday: formattedDate
        }));
    }

    const handleSubmit = () =>{
        axios.post(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/account/register`, {
            email: accountInfo.email,
            first_name: accountInfo.first_name,
            last_name: accountInfo.first_name,
            gender: accountInfo.gender,
            birthday: accountInfo.birthday,
            password: accountInfo.password,
            role: accountInfo.role
          })
          .then(function (response) {
            console.log(response);
            window.location.href = '/OTP'; 
          })
          .catch(function (error) {
            setError(error.message);
          });
    }
    return (
        <div className="Sign_up__wrapper">
            <img src="/assets/images/poster_login.png" alt="poster" className="Sign_up__poster" />
            <div className='Sign_up'>
                <img src="/assets/images/logo.png" alt="logo" className="Sign_up__logo" />
                <div className="Sign_up__nav">
                    <Link to={'/login'} className="Sign_up__nav--signin_btn">Đăng nhập</Link>
                    <Link to={'/sign_up'} className="Sign_up__nav--sign_up_btn active">Đăng ký</Link>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='Sign_up__form'>
                    <div className="form__full_name">
                        <div className="form_first_name">
                            <label htmlFor="firstname" className='form__label'>Họ</label>
                            <input type="text" id="firstname" placeholder='Nhập họ' className='form__input_name' />
                        </div>
                        <div className="form_last_name">
                            <label htmlFor="lastname" className='form__label'>Tên</label>
                            <input type="text" id="lastname" placeholder='Nhập tên' className='form__input_name' />
                        </div>
                    </div>
                    <label htmlFor="gender" className='form__label'>Giới tính</label>
                    <select name="gender" className='form__input' >
                        <option value="1">Nam</option>
                        <option value="0">Nữ</option>
                    </select>
                    <label htmlFor="birthday" className='form__label'>Ngày sinh</label>
                    <Datetime
                        id="birthday"
                        value={accountInfo.birthday}
                        onChange={handleDateChange}
                        dateFormat="YYYY-MM-DD"
                        timeFormat={false}
                        closeOnSelect={true}
                        placeholderText="Chọn ngày sinh"
                        className='form__input'
                    />
                    {/* <input type="text" id="birthday" placeholder='Nhập ngày sinh' /> */}
                    <label htmlFor="email" className='form__label'>Email</label>
                    <input type="text" id="email" placeholder='Nhập email' className='form__input' />
                    <label htmlFor="role" className='form__label'>Loại tài khoản</label>
                    <select name="role" className='form__input' >
                        <option value="business">Đơn vị tổ chức</option>
                        <option value="customer">Khách hàng</option>
                    </select>
                    <label htmlFor="password" className='form__label'>Mật khẩu</label>
                    <input type="text" id="password" placeholder='Nhập mật khẩu' className='form__input' />
                    <Link to={'/forgot_password'} className="Sign_up__form--forgot">Bạn đã có tài khoản? <b>Đăng nhập</b></Link>
                    {error != "" && <span className="error">{error}</span>}
                    <button className='Sign_up__form--submit_btn' type="submit">Đăng ký</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;