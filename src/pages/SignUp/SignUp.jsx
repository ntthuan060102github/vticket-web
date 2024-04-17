import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { format } from 'date-fns';
import moment from 'moment';
import 'moment/locale/vi';


import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import './SignUp.css'
import validator from "validator";

moment.locale('vi');
function SignUp() {


    const [accountInfo, setAccountInfo] = React.useState({
        email: "",
        first_name: "",
        last_name: "",
        gender: 1,
        birthday: new Date(),
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
        console.log(typeof(date));
        const formattedDate = date.format("YYYY-MM-DD");
        console.log(formattedDate);
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
        console.log(accountInfo);
        const newErrors = {};
        if (!accountInfo.first_name) {
            newErrors["first_name"] ="Họ không được trống";
        }

        if (!accountInfo.last_name) {
            newErrors["last_name"] ="Tên không được trống";
        }

        if (!accountInfo.birthday) {
            newErrors["birthday"] ="Ngày sinh không được trống";
        }

        if (!validator.isEmail(accountInfo.email)) {
            newErrors["email"] ="Email không đúng format";
        }

        if (!accountInfo.password) {
            newErrors["password"] ="Mật khẩu không được để trống";
        };

        if (accountInfo.password !== accountInfo.re_enter_password) {
            newErrors["re_enter_password"] ="Mật khẩu không trùng khớp";
        };

        if (Object.keys(newErrors).length !== 0) {
            setErrors(newErrors);
            return;
        }
        else{
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
                    navigate(`/otp/${accountInfo.email}`);
                } else {
                    newErrors["sign-up"] = response.data.message;
                    setErrors(newErrors);
                }
            })
            .catch(function (error) {
                newErrors["error"] =error.message;
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
                    <div className="sign_up_form__full_name">
                        <div className="form_first_name">
                            <label htmlFor="first_name" className='sign_up_form__label'>Họ</label>
                            <input 
                                type="text" 
                                id="first_name" 
                                name="first_name" 
                                placeholder='Nhập họ' 
                                className={errors.first_name ? "sign_up_form__input_name error-input" : "sign_up_form__input_name normal-input"}
                                onChange={handleChange} />
                            {errors["first_name"] && <span className="error">{errors["first_name"]}</span>}
                        </div>
                        <div className="form_last_name">
                            <label htmlFor="last_name" className='sign_up_form__label'>Tên</label>
                            <input 
                                type="text" 
                                id="last_name" 
                                name="last_name" 
                                placeholder='Nhập tên' 
                                className={errors.last_name ? "sign_up_form__input_name error-input" : "sign_up_form__input_name normal-input"}
                                onChange={handleChange} 
                            />
                            {errors["last_name"] && <span className="error">{errors["last_name"]}</span>}
                        </div>
                    </div>
                    <label htmlFor="gender" className='sign_up_form__label'>Giới tính</label>
                    <select 
                        name="gender" 
                        className='sign_up_form__input' 
                        value={accountInfo.gender} 
                        onChange={handleChange} >
                        <option value="1">Nam</option>
                        <option value="0">Nữ</option>
                        <option value="-1">Riêng tư</option>
                    </select>
                    <label htmlFor="birthday" className='sign_up_form__label'>Ngày sinh</label>
                    <Datetime
                        id="birthday"
                        value={format(accountInfo.birthday,"dd-MM-yyyy")}
                        onChange={handleDateChange}
                        dateFormat="DD-MM-YYYY"
                        timeFormat={false}
                        locale="vi"
                        closeOnSelect={true}
                        renderMonth={(props, month) => <td {...props}>Thg {month + 1}</td>}
                        placeholderText="Chọn ngày sinh"
                        isValidDate={isValidDate}
                        className={errors.birthday ? "sign_up_form__input error-input" : "sign_up_form__input normal-input"}
                    />
                    {errors["birthday"] && <span className="error">{errors["birthday"]}</span>}
                    <label htmlFor="email" className='sign_up_form__label'>Email</label>
                    <input 
                        type="text" 
                        id="email" 
                        name="email" 
                        placeholder='Nhập email' 
                        className={errors.email ? "sign_up_form__input error-input" : "sign_up_form__input normal-input"}
                        onChange={handleChange} />
                    {errors["email"] && <span className="error">{errors["email"]}</span>}
                    <label htmlFor="role" className='sign_up_form__label'>Loại tài khoản</label>
                    <select id="role" name="role" className='sign_up_form__input' value={accountInfo.role} onChange={handleChange} >
                        <option value="customer">Khách hàng</option>
                        <option value="business">Đơn vị tổ chức</option>
                    </select>
                    <label htmlFor="password" className='sign_up_form__label'>Mật khẩu</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder='Nhập mật khẩu' 
                        className={errors.password ? "sign_up_form__input error-input" : "sign_up_form__input normal-input"}
                        onChange={handleChange} />
                    {errors["password"] && <span className="error">{errors["password"]}</span>}
                    <label htmlFor="re_enter_password" className='sign_up_form__label'>Nhập lại mật khẩu</label>
                    <input 
                        type="password" 
                        id="re_enter_password" 
                        name="re_enter_password" 
                        placeholder='Nhập lại mật khẩu' 
                        className={errors.re_enter_password ? "sign_up_form__input error-input" : "sign_up_form__input normal-input"} 
                        onChange={handleChange} />
                    {errors["re_enter_password"] && <span className="error">{errors["re_enter_password"]}</span>}
                    <Link to={'/login'} className="Sign_up__form--login_return">Bạn đã có tài khoản? <b>Đăng nhập</b></Link>
                    {errors["sign-up"] && <span className="error">{errors["sign-up"]}</span>}
                    {errors["error"] && <span className="error">{errors["error"]}</span>}
                    <button className='Sign_up__form--submit_btn' type="submit">Đăng ký</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;