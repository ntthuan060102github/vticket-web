import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { format } from 'date-fns';
import moment from 'moment';
import 'moment/locale/vi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faUser } from '@fortawesome/free-solid-svg-icons';
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

  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');

  const [errors, setErrors] = React.useState([]);

  
  const access = localStorage.getItem('access');
  const first_name = localStorage.getItem('first_name');
  const last_name = localStorage.getItem('last_name');
  const avatar_url = localStorage.getItem('avatar_url');
  const gender = localStorage.getItem('gender');
  const birthday = localStorage.getItem('birthday');
  const phone_number = localStorage.getItem('phone_number');


  const [accountInfo, setAccountInfo] = React.useState({
    first_name: first_name,
    last_name: last_name,
    gender: gender,
    birthday: birthday ,
    phone_number: phone_number,
    avatar_url : avatar_url
  });

  const [avatarFile,setAvatarFile] = React.useState([]);
  const [avatarURL,setAvatarURL] = React.useState(accountInfo.avatar_url);
  

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

  const handleFileChange = (event) => {
    console.log(1)
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      axios.post(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/profile/avatar`, {
        Authorization: accountInfo.username,
        image: selectedFile,
      })
      .then(function (response) {
          if (response.data.status === 1) {
              localStorage.setItem("avatar_url", response.data.data.avatar_url);
              setAvatarURL(response.data.data.avatar_url)
          } else {
              setErrors(...errors, response.data.message);
          }
      })
      .catch(function (error) {
              setErrors(...errors, error);
      });
    }
  };

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
  useEffect(() => {
    axios.post(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/token`, {
      email: email,
      password: password,
    })
    .then(function (response) {
        if (response.data.status === 1) {
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
            localStorage.setItem("password", password);
            localStorage.setItem("role", response.data.data.profile.role);
        } else {
            setErrors(response.data.message);
        }
    })
    .catch(function (error) {
        setErrors(error);
    });

  }, [avatarURL]);
  return (
    <div className="Profile_customer__wrapper">
      <Header />
      <div className="Profile_customer">
        <div className="Profile_customer__sidebar">
          <div className="Sidebar__avt_name">
            <img src={!accountInfo.avatar_url ? accountInfo.avatar_url : "/assets/images/avatar_default.png"} alt="User Avatar" className="Sidebar_avt" />
            <h2 className="Sidebar__name">{last_name} {first_name}</h2>
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
            <div className='Profile_customer__avatar'>
              <img src={!avatarURL ? avatarURL : "/assets/images/avatar_default.png"} alt="User Avatar" className="form_avt" />
              <label htmlFor="avatarInput" style={{ cursor: 'pointer' }} className='import_file_avatar'>
                <input
                  id="avatarInput"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <FontAwesomeIcon icon={faPencil} className='iconPencil'/>
              </label>
              <button className="update_avatar">Đổi ảnh đại diện</button>
            </div>
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