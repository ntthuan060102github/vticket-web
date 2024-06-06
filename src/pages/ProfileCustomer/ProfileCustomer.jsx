import React from 'react';
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
import './ProfileCustomer.css'
import Header from '../../components/Header';

function ProfileCustomer() {

  const [errors, setErrors] = React.useState([]);

  const [changedIndex, setChangedIndex] = React.useState(0);

  const [firstName, setFirstName] = React.useState(localStorage.getItem('first_name'));
  const [lastName, setLastName] = React.useState(localStorage.getItem('last_name'));
  const [avatarUrl, setAvatarUrl] = React.useState(localStorage.getItem('avatar_url'));
  const [gender, setGender] = React.useState(localStorage.getItem('gender'));
  const [birthday, setBirthday] = React.useState(localStorage.getItem('birthday'));
  const [phoneNumber, setPhoneNumber] = React.useState(localStorage.getItem('phone_number'));

  React.useEffect(()=>{
    setFirstName(localStorage.getItem('first_name'));
    setLastName(localStorage.getItem('last_name'));
    setAvatarUrl(localStorage.getItem('avatar_url'));
    setGender(localStorage.getItem('gender'));
    setBirthday(localStorage.getItem('birthday'));
    setPhoneNumber(localStorage.getItem('phone_number'));
  },[changedIndex]);

  const [accountInfo, setAccountInfo] = React.useState({
    first_name: firstName,
    last_name: lastName,
    gender: gender,
    birthday: birthday ,
    phone_number: phoneNumber,
    avatar_url : avatarUrl
  });

  const [avatarURL,setAvatarURL] = React.useState(accountInfo.avatar_url);

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
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    axios({
      method: 'post',
      url: `${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/profile/avatar`,
      data: {image: formData.get("file")},
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(function (response) {
        if (response.data.status === 1) {
            setAvatarURL(response.data.data.avatar_url)
        } else {
            setErrors(...errors, response.data.message);
        }
    })
    .catch(function (error) {
            setErrors(...errors, error);
    });
  };

  const handleDateChange = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const onlyFormattedDate = new Date(formattedDate).toISOString().split('T')[0];
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

  const phoneRegex = /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

  function validatePhoneNumber(phoneNumber) {
    return phoneRegex.test(phoneNumber);
  }

  const handleSubmit = () => {
    const newErrors = {};
    setErrors([]);
    if (!accountInfo.first_name) {
      newErrors["first_name"] = "Họ không được trống";
    }

    if (!accountInfo.last_name) {
      newErrors["last_name"] = "Tên không được trống";
    }

    if (!accountInfo.birthday) {
      newErrors["birthday"] = "Ngày sinh không được trống";
    }

    if (!accountInfo.gender) {
      newErrors["gender"] = "Giới tính không được để trống";
    };

    if (!validatePhoneNumber(accountInfo.phone_number)) {
      newErrors["phone_number"] = "Số điện thoại không hợp lệ";
    };

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return;
    }
    else {
      axios.patch(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/profile/me`, {
        first_name: accountInfo.first_name,
        last_name: accountInfo.first_name,
        gender: accountInfo.gender,
        birthday: accountInfo.birthday,
        phone_number: accountInfo.phone_number
      })
        .then(function (response) {
          if (response.data.status === 1) {
            localStorage.setItem("first_name", accountInfo.first_name);
            localStorage.setItem("last_name", accountInfo.last_name);
            localStorage.setItem("gender", accountInfo.gender);
            localStorage.setItem("birthday", accountInfo.birthday);
            localStorage.setItem("phone_number", accountInfo.phone_number);
            localStorage.setItem("avatar_url", avatarURL);
            setAccountInfo((prevValue) => ({
              ...prevValue,
              avatar_url: avatarURL,
            }));
            setChangedIndex((prev) => prev + 1);
          } else {
            newErrors["change_info"] = response.data.message;
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
            <img src={accountInfo.avatar_url ? accountInfo.avatar_url : "/assets/images/avatar_default.png"} alt="User Avatar" className="Sidebar_avt" />
            <h2 className="Sidebar__name">{firstName} {lastName}</h2>
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
              <img src={avatarURL ? avatarURL : "/assets/images/avatar_default.png"} alt="User Avatar" className="form_avt" />
              <label htmlFor="avatarInput" style={{ cursor: 'pointer' }} className='import_file_avatar'>
                <input
                  id="avatarInput"
                  type="file"
                  name='image'
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <FontAwesomeIcon icon={faPencil} className='iconPencil'/>
              </label>
              {/* <button className="update_avatar" onClick={handleChangeAvatar}>Đổi ảnh đại diện</button> */}
            </div>
            <div className="Profile_customer_form__full_name">
              <div className="form_first_name">
                <label htmlFor="first_name" className='Profile_customer_form__label'>Họ</label>
                <input
                  type="text"
                  id="first_name"
                  value={accountInfo.first_name}
                  name="first_name"
                  className={errors.first_name ? "Profile_customer_form__input_name error-input" : "Profile_customer_form__input_name normal-input"}
                  onChange={handleChange} />
                {errors["first_name"] && <span className="error">{errors["first_name"]}</span>}
              </div>
              <div className="form_last_name">
                <label htmlFor="last_name" className='Profile_customer_form__label'>Tên</label>
                <input
                  type="text"
                  id="last_name"
                  value={accountInfo.last_name}
                  name="last_name"
                  className={errors.last_name ? "Profile_customer_form__input_name error-input" : "Profile_customer_form__input_name normal-input"}
                  onChange={handleChange}
                />
                {errors["last_name"] && <span className="error">{errors["last_name"]}</span>}
              </div>
            </div>
            <label htmlFor="gender" className='Profile_customer_form__label'>Giới tính</label>
            <select
              name="gender"
              className='Profile_customer_form__input'
              value={accountInfo.gender}
              onChange={handleChange} >
              <option value="1">Nam</option>
              <option value="0">Nữ</option>
              <option value="-1">Riêng tư</option>
            </select>
            <label htmlFor="birthday" className='Profile_customer_form__label'>Ngày sinh</label>
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
              className={errors.birthday ? "Profile_customer_form__input_date error-input" : "Profile_customer_form__input_date normal-input"}
            />
            {errors["birthday"] && <span className="error">{errors["birthday"]}</span>}
            <label htmlFor="phone_number" className='Profile_customer_form__label'>SĐT</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={accountInfo.phone_number !== 'null' ? accountInfo.phone_number : ''}
              onChange={handleChange}
              className={errors.phone_number ? "Profile_customer_form__input error-input" : "Profile_customer_form__input normal-input"} />
            {errors["phone_number"] && <span className="error">{errors["phone_number"]}</span>}
            <button className='Profile_customer__form--submit_btn' onClick={handleSubmit}>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileCustomer;