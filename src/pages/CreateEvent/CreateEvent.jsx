import React, { useRef, useState, useEffect } from 'react';
// import Time from 'react-time';
import TimePicker from 'react-time-picker';
import dayjs, { Dayjs } from 'dayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { format } from 'date-fns';
import moment from 'moment';
import 'moment/locale/vi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import validator from "validator";
import './CreateEvent.css'
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

function CreateEvent() {

  const date = new Date();
  const  [eventInfo, setEventInfo] = React.useState({
    "ticket_types": [],
    "event_topics": [],
    "name": "",
    "description": "",
    "start_date": date,
    "end_date": date,
    "start_time": date.getHours()+':'+date.getMinutes(),
    "location": "",
    "banner_url": ""
  });

  // const [ticketTypes, setTicketTypes] = React.useState([]);
  // const [ticketType, setTicketType] = React.useState([
  //   "ticket_type_detail" = new ticket_type_detail(),
  //   "seat_configuration" = new seat_configuration()
  // ]);

  const [errors, setErrors] = React.useState([]);
  const navigate = useNavigate();
  const [taskName, setTaskName] = React.useState("event_input");

  const addTicketType = () => {
    setEventInfo(prevData => ({
      ...prevData,
      ticket_types: [
        ...prevData.ticket_types,
        {
          ticket_type_detail: [
            {
              name: "",
              description: "",
              fee_type: "percent",
              fee_value: 0
            }
          ],
          seat_configuration: [
            {
              position: "",
              seat_number: 0
            }
          ],
          name: "",
          description: "",
          price: 0
        }
      ]
    }));
  };

  const handleNextTask = () =>{
    if(taskName === "event_input"){
      setTaskName("ticket_type_input")
    }else if(taskName === "ticket_type_input"){
      setTaskName("service_input")
    }else if(taskName === "service_input"){
      setTaskName("seat_class_input")
    }
  }

  const handleChange = (event) =>{
      let value = event.target.value;
      let name = event.target.name;

      setEventInfo((prevalue) => {
          return {
              ...prevalue,                
              [name]: value
          }
      })
  }

  const handleDateChange = (date, name) => {
      console.log(typeof(date));
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const onlyFormattedDate = new Date(formattedDate).toISOString().split('T')[0];
      console.log(onlyFormattedDate);
      setEventInfo((prevValue) => ({
          ...prevValue,
          [name]: onlyFormattedDate
      }));
  }

  const handleTimeChange = (newTime) => {
  //   // Check if the new time matches the format HH:mm
  //   const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  //   if (!timeRegex.test(newTime)) {
  //     // If the format doesn't match, handle the error appropriately
  //     console.error('Invalid time format. Expected format: HH:mm');
  //     return;
  //   }

    setEventInfo((prevValue) => ({
      ...prevValue,
      start_date: newTime
    }));
  
    console.log("New time:", newTime);
    console.log("Type", typeof(newTime));
  };

  const isValidDate = (currentDate) => {
      const selectedDate = currentDate.toDate();
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison
      return selectedDate <= today;
  };


  const handleSubmit = () =>{
      const newErrors = {};

      if (!validator.isEmail(eventInfo.username)) {
          newErrors["email"] = "Email không đúng định dạng";
      }

      if (!eventInfo.password) {
          newErrors["password"] = "Mật khẩu không được để trống";
      };

      if (Object.keys(newErrors).length !== 0) {
          setErrors(newErrors);
          return;
      }else{
          console.log(1)
          axios.post(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/token`, {
              email: eventInfo.username,
              password: eventInfo.password,
          })
          .then(function (response) {
              if (response.data.status === 1) {
                  navigate('/');
                  localStorage.setItem('access', response.data.data.access);
                  localStorage.setItem('refresh', response.data.data.refresh);
              } else {
                  newErrors["Create_event"] = response.data.message;
                  setErrors(newErrors);
              }
          })
          .catch(function (error) {
              newErrors["error"] = error.message;
              setErrors(newErrors);
          });
      }
  }

  // React.useEffect(() => {
  //   setEventInfo(prevState => ({
  //       ...prevState,
  //       start_time: moment(new Date()).format("HH:mm") // Tính toán giá trị start_time ở đây
  //   }));
  // }, []);
  return (
    <div className="Create_event__wrapper">
      <Header/>
      <div className="Create_event"> 
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='Create_event__form'>
          {taskName == 'event_input' && 
          <div className="Create_event__infor_event_input">
            <h2 className="Create_event__infor_event_input--title">Nhập thông tin sự kiện</h2>
            <label htmlFor="event_name" className='Create_event_form__label'>Tên sự kiện</label>
            <input 
                type="text" 
                id="event_name" 
                name="name"
                value={eventInfo.name}
                onChange={handleChange}
                placeholder='Nhập tên sự kiện' 
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            {errors["email"] && <span className="error">{errors["email"]}</span>}
            <label htmlFor="description" className='Create_event_form__label'>Mô tả</label>
            <textarea   
              type="text" 
              id="description" 
              name="description"
              value={eventInfo.description}
              onChange={handleChange}
              placeholder='Nhập mô tả sự kiện' 
              className={errors.password ? "Create_event_form__input_description error-input" : "Create_event_form__input_descriptio normal-input"}
              rows={4} 
              cols={40} 
            />
            <label htmlFor="start_date" className='Create_event_form__label'>Ngày bắt đầu</label>
            <Datetime
                id="start_date"
                name="start_date"
                value={format(eventInfo.start_date,"dd-MM-yyyy")}
                onChange={handleDateChange}
                dateFormat="DD-MM-YYYY"
                timeFormat={false}
                locale="vi"
                closeOnSelect={true}
                renderMonth={(props, month) => <td {...props}>Thg {month + 1}</td>}
                placeholderText="Chọn ngày sinh"
                isValidDate={isValidDate}
                className={errors.birthday ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            <label htmlFor="end_date" className='Create_event_form__label'>Ngày kết thúc</label>
            <Datetime
                id="end_date"
                name="end_date"
                value={format(eventInfo.end_date,"dd-MM-yyyy")}
                onChange={handleDateChange}
                dateFormat="DD-MM-YYYY"
                timeFormat={false}
                locale="vi"
                closeOnSelect={true}
                renderMonth={(props, month) => <td {...props}>Thg {month + 1}</td>}
                placeholderText="Chọn ngày sinh"
                isValidDate={isValidDate}
                className={errors.birthday ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            <label htmlFor="start_time" className='Create_event_form__label'>Giờ khai mạc</label>
            <input 
              type="time" 
              value={eventInfo.start_time} 
              onChange={handleTimeChange} 
            />
            <label htmlFor="event_name" className='Create_event_form__label'>Tên sự kiện</label>
            <input 
                type="text" 
                id="event_name" 
                name="name"
                value={eventInfo.name}
                onChange={handleChange}
                placeholder='Nhập tên sự kiện' 
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            <label htmlFor="event_name" className='Create_event_form__label'>Tên sự kiện</label>
            <input 
                type="text" 
                id="event_name" 
                name="name"
                value={eventInfo.name}
                onChange={handleChange}
                placeholder='Nhập tên sự kiện' 
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            <label htmlFor="event_name" className='Create_event_form__label'>Tên sự kiện</label>
            <input 
                type="text" 
                id="event_name" 
                name="name"
                value={eventInfo.name}
                onChange={handleChange}
                placeholder='Nhập tên sự kiện' 
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            <button className='Create_event__form--submit_btn' onClick={handleNextTask}>Tiếp theo</button>
          </div>}
          {taskName == 'ticket_type_input' && 
          <div className="Create_event__infor_event_input">
            <h2 className="Create_event__infor_event_input--title">Thêm các loại vé</h2>
            <label htmlFor="event_name" className='Create_event_form__label'>Tên loại vé</label>
            <input 
                type="text" 
                id="event_name" 
                name="name"
                value={eventInfo.name}
                onChange={handleChange}
                placeholder='Nhập tên loại vé' 
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            {errors["email"] && <span className="error">{errors["email"]}</span>}
            <label htmlFor="description" className='Create_event_form__label'>Mô tả</label>
            <textarea   
              type="text" 
              id="description" 
              name="description"
              value={eventInfo.description}
              onChange={handleChange}
              placeholder='Nhập mô tả loại vé' 
              className={errors.password ? "Create_event_form__input_description error-input" : "Create_event_form__input_descriptio normal-input"}
              rows={4} 
              cols={40} 
            />
            <label htmlFor="price" className='Create_event_form__label'>Giá vé</label>
            <input 
                type="text" 
                id="price" 
                name="name"
                value={eventInfo.name}
                onChange={handleChange}
                placeholder='Nhập giá vé' 
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            <button className='Create_event__form--submit_btn'>Thêm</button>
            <h3 className="List_ticket_type__title">Danh sách các loại vé</h3>
            <div className="List_ticket_type">

            </div>
            <button className='Create_event__form--submit_btn' onClick={handleNextTask}>Tiếp theo</button>
          </div>}
          {taskName == 'service_input' && 
          <div className="Create_event__infor_event_input">
            <h2 className="Create_event__infor_event_input--title">Thêm các dịch vụ gia tăng</h2>
            <label htmlFor="event_name" className='Create_event_form__label'>Tên hạng vé</label>
            <input 
                type="text" 
                id="event_name" 
                name="name"
                value={eventInfo.name}
                onChange={handleChange}
                placeholder='Nhập tên hạng vé' 
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            <label htmlFor="event_name" className='Create_event_form__label'>Tên dịch vụ</label>
            <input 
                type="text" 
                id="event_name" 
                name="name"
                value={eventInfo.name}
                onChange={handleChange}
                placeholder='Nhập tên dịch vụ' 
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            {errors["email"] && <span className="error">{errors["email"]}</span>}
            <label htmlFor="description" className='Create_event_form__label'>Mô tả</label>
            <textarea   
              type="text" 
              id="description" 
              name="description"
              value={eventInfo.description}
              onChange={handleChange}
              placeholder='Nhập mô tả sự kiện' 
              className={errors.password ? "Create_event_form__input_description error-input" : "Create_event_form__input_descriptio normal-input"}
              rows={4} 
              cols={40} 
            />
            <label htmlFor="price" className='Create_event_form__label'>Loại giá dịch vụ</label>
            <input 
                type="text" 
                id="price" 
                name="name"
                value={eventInfo.name}
                onChange={handleChange}
                placeholder='Nhập loại giá dịch vụ' 
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            <label htmlFor="price" className='Create_event_form__label'>Giá dịch vụ</label>
            <input 
                type="text" 
                id="price" 
                name="name"
                value={eventInfo.name}
                onChange={handleChange}
                placeholder='Nhập giá dịch vụ' 
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            <button className='Create_event__form--submit_btn'>Thêm</button>
            <h3 className="form__list--title">Danh sách các dịch vụ</h3>
            <div className="form__list">

            </div>
            <button className='Create_event__form--submit_btn' onClick={handleNextTask}>Tiếp theo</button>
          </div> }
          {taskName == 'seat_class_input' && 
          <div className="Create_event__infor_event_input">
            <h2 className="Create_event__infor_event_input--title">Thêm các hàng ghế</h2>
            <label htmlFor="event_name" className='Create_event_form__label'>Tên hạng vé</label>
            <input 
                type="text" 
                id="event_name" 
                name="name"
                value={eventInfo.name}
                onChange={handleChange}
                placeholder='Nhập tên hạng vé' 
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            <label htmlFor="event_name" className='Create_event_form__label'>Hàng ghế</label>
            <input 
                type="text" 
                id="event_name" 
                name="name"
                value={eventInfo.name}
                onChange={handleChange}
                placeholder='Nhập hàng ghế' 
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
            />
            <div className="form__seat_range">
              <div className="form__start_seat">
                  <label htmlFor="start_seat" className='sign_up_form__label'>Số ghế bắt đầu</label>
                  <input 
                      type="text" 
                      id="start_seat" 
                      name="start_seat" 
                      placeholder='Ghế bắt đầu' 
                      className={errors.first_name ? "form_input_seat error-input" : "form_input_seat normal-input"}
                      onChange={handleChange} />
                  {errors["first_name"] && <span className="error">{errors["first_name"]}</span>}
              </div>
              <div className="form_last_seat">
                  <label htmlFor="last_seat" className='sign_up_form__label'>Số ghế kết thúc</label>
                  <input 
                      type="text" 
                      id="last_seat" 
                      name="last_seat" 
                      placeholder='Ghế kết thúc' 
                      className={errors.last_name ? "form_input_seat error-input" : "form_input_seat normal-input"}
                      onChange={handleChange} 
                  />
                  {errors["last_name"] && <span className="error">{errors["last_name"]}</span>}
              </div>
            </div>
            <button className='Create_event__form--submit_btn'>Thêm</button>
            <h3 className="form__list--title">Danh sách các hàng ghế</h3>
            <div className="form__list">

            </div>
            <button className='Create_event__form--submit_btn'>Tiếp theo</button>
          </div>
          }
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;