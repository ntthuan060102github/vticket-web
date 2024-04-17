import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import './SignUp.css'
import validator from "validator";

function SignUp() {


    const [accountInfo, setAccountInfo] = React.useState({
        email: "",
        first_name: "",
        last_name: "",
        gender: 1,
        birthday: "",
        password: "",
        re_enter_password: "",
        role: "customer",
    });



    const [errors, setErrors] = React.useState([]);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;

        setAccountInfo((prevalue) => {
            return {
                ...prevalue,           
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

    const isValidDate = (currentDate) => {
        const selectedDate = currentDate.toDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison
        return selectedDate <= today;
    };

    const handleSubmit = () => {
        const newErrors = [];
        if (!accountInfo.first_name) {
            newErrors.push("Họ không được trống");
        }

        if (!accountInfo.last_name) {
            newErrors.push("Tên không được trống");
        }

        if (!accountInfo.birthday) {
            newErrors.push("Ngày sinh không được trống");
        }

        if (!validator.isEmail(accountInfo.email)) {
            newErrors.push("Email không đúng format");
        }

        if (accountInfo.password !== accountInfo.re_enter_password) {
            newErrors.push("Mật khẩu không trùng khớp");
        };

        if (newErrors.length !== 0) {
            setErrors(newErrors);
            return;
        }
        else{
            console.log(accountInfo);
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
                if (response.data.status === 1) {
                    navigate(`/OTP/${accountInfo.email}`);
                } else {
                    newErrors.push("Đăng ký thất bại");
                    setErrors(newErrors);
                }
            })
            .catch(function (error) {
                newErrors.push(error.message);
                setErrors(newErrors);
            });
        }
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
                            <input type="text" id="firstname" name="first_name" placeholder='Nhập họ' className='form__input_name' onChange={handleChange} />
                        </div>
                        <div className="form_last_name">
                            <label htmlFor="lastname" className='form__label'>Tên</label>
                            <input type="text" id="lastname" name="last_name" placeholder='Nhập tên' className='form__input_name' onChange={handleChange} />
                        </div>
                    </div>
                    <label htmlFor="gender" className='form__label'>Giới tính</label>
                    <select name="gender" className='form__input' value={accountInfo.gender} onChange={handleChange} >
                        <option value="1">Nam</option>
                        <option value="0">Nữ</option>
                        <option value="-1">Riêng tư</option>
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
                        isValidDate={isValidDate}
                        className='form__input'
                    />
                    <label htmlFor="email" className='form__label'>Email</label>
                    <input type="text" id="email" name="email" placeholder='Nhập email' className='form__input' onChange={handleChange} />
                    <label htmlFor="role" className='form__label'>Loại tài khoản</label>
                    <select id="role" name="role" className='form__input' value={accountInfo.role} onChange={handleChange} >
                        <option value="customer">Khách hàng</option>
                        <option value="business">Đơn vị tổ chức</option>
                    </select>
                    <label htmlFor="password" className='form__label'>Mật khẩu</label>
                    <input type="password" id="password" name="password" placeholder='Nhập mật khẩu' className='form__input' onChange={handleChange} />
                    <label htmlFor="re_enter_password" className='form__label'>Nhập lại mật khẩu</label>
                    <input type="password" id="re_enter_password" name="re_enter_password" placeholder='Nhập lại mật khẩu' className='form__input' onChange={handleChange} />
                    <Link to={'/login'} className="Sign_up__form--login_return">Bạn đã có tài khoản? <b>Đăng nhập</b></Link>
                    {errors.map((error, index) => {
                        return <span key={index} className="error">{error}</span>;
                    })}
                    <button className='Sign_up__form--submit_btn' type="submit">Đăng ký</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;