import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { format } from 'date-fns';
import moment from 'moment';
import 'moment/locale/vi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import validator from "validator";
import './ProfileCustomer.css'
import Header from '../../components/Header';

function TimeInput({ value, onChange }) {
  return (
    <input
      type="time"
      value={value}
      onChange={onChange}
    />
  );
}

function ProfileCustomer() {
  const profile = localStorage.getItem('profile');

  const [accountInfo, setAccountInfo] = React.useState({
    email: profile.email,
    first_name: profile.first_name || "Võ",
    last_name: profile.last_name|| "Sơn",
    gender: profile.gender,
    birthday: profile.birth || new Date(),
    phone_number: profile.phone_number || ""
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
    console.log(typeof (date));
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const onlyFormattedDate = new Date(formattedDate).toISOString().split('T')[0];
    console.log(onlyFormattedDate);
    setAccountInfo((prevValue) => ({
      ...prevValue,
      birthday: onlyFormattedDate
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
      newErrors["first_name"] = "Họ không được trống";
    }

    if (!accountInfo.last_name) {
      newErrors["last_name"] = "Tên không được trống";
    }

    if (!accountInfo.birthday) {
      newErrors["birthday"] = "Ngày sinh không được trống";
    }

    if (!validator.isEmail(accountInfo.email)) {
      newErrors["email"] = "Email không đúng format";
    }

    if (!accountInfo.password) {
      newErrors["password"] = "Mật khẩu không được để trống";
    };

    if (accountInfo.password !== accountInfo.re_enter_password) {
      newErrors["re_enter_password"] = "Mật khẩu không trùng khớp";
    };

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return;
    }
    else {
      axios.post(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/account/register`, {
        email: accountInfo.email,
        first_name: accountInfo.first_name,
        last_name: accountInfo.first_name,
        gender: accountInfo.gender,
        birthday: accountInfo.birthday,
        phone_number: accountInfo.phone_number
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
          newErrors["error"] = error.message;
          setErrors(newErrors);
        });
    }
  }
  return (
    <div className="Profile_customer__wrapper">
      <Header />
      <div className="Profile_customer">
        <div className="Profile_customer__sidebar">
          <div className="Sidebar__avt_name">
            <img src={profile.avatar_url ? profile.avatar_url : "/assets/images/avatar_default.png"} alt="User Avatar" className="Sidebar_avt" />
            <h2 className="Sidebar__name">{profile.last_name} {profile.first_name}</h2>
          </div>
          <ul class="Sidebar__menu">
            <li><a href="#infor" class="Sidebar__menu--item">
              <FontAwesomeIcon icon={faUser} className="user_icon" />
              Thông tin cá nhân
            </a></li>
          </ul>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='Profile_customer__form'>
          <div className="Profile_customer__infor_event_input">
            <h2 className="Profile_customer__infor_event_input--title">Thông tin cá nhân</h2>
            <div className="sign_up_form__full_name">
              <div className="form_first_name">
                <label htmlFor="first_name" className='sign_up_form__label'>Họ</label>
                <input
                  type="text"
                  id="first_name"
                  value={accountInfo.first_name}
                  name="first_name"
                  className={errors.first_name ? "sign_up_form__input_name error-input" : "sign_up_form__input_name normal-input"}
                  onChange={handleChange} />
                {errors["first_name"] && <span className="error">{errors["first_name"]}</span>}
              </div>
              <div className="form_last_name">
                <label htmlFor="last_name" className='sign_up_form__label'>Tên</label>
                <input
                  type="text"
                  id="last_name"
                  value={accountInfo.last_name}
                  name="last_name"
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
              value={format(accountInfo.birthday, "dd-MM-yyyy")}
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
            <label htmlFor="phone_number" className='sign_up_form__label'>SĐT</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={accountInfo.phone_number}
              className={errors.email ? "sign_up_form__input error-input" : "sign_up_form__input normal-input"}
              onChange={handleChange} />
            {errors["email"] && <span className="error">{errors["email"]}</span>}
            <button className='Profile_customer__form--submit_btn' type='submit'>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileCustomer;