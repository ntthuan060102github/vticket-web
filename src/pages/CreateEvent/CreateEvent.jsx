import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { format } from 'date-fns';
import moment from 'moment';
import 'moment/locale/vi';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NumericFormat } from "react-number-format";
import { TextField } from "@mui/material";
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import validator from "validator";
import './CreateEvent.css'
import Header from '../../components/Header';
import TimeInput from "../../components/TimeInput";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';

function CreateEvent() {
  const accessToken = localStorage.getItem('access');

  const dateCurrent = new Date();
  const formattedDateCurrent = moment(dateCurrent).format("YYYY-MM-DD");
  const onlyFormattedDateCurrent = new Date(formattedDateCurrent).toISOString().split('T')[0];

  const [eventInfo, setEventInfo] = React.useState({
    "ticket_types": [],
    "event_topics": [],
    "event_name": "",
    "description": "",
    "start_date": onlyFormattedDateCurrent,
    "end_date": onlyFormattedDateCurrent,
    "start_time": new Date().getHours() + ':' + new Date().getMinutes(),
    "location": "",
    "banner_url": ""
  });

  const [ticketTypes, setTicketTypes] = React.useState([
    {
      description :"",
      price: "100,000 VNĐ",
      seat_configurations:[],
      ticket_type_details: [],
      ticket_type_name: "Loại VIP",
    },
    {
      description :"",
      price: "100,000 VNĐ",
      seat_configurations:[],
      ticket_type_details: [],
      ticket_type_name: "Loại Premium",
    }
  ]);
  const [ticket_Type, setTicket_Type] = React.useState({
    "ticket_type_name": "",
    "description": "",
    "price": 0,
    "ticket_type_details": [], // Chi tiết loại vé (thêm từ API Tạo Chi Tiết Loại Vé)
    "seat_configurations": [], // Cấu hình ghế (thêm từ API Tạo Cấu Hình Ghế)
  });

  const [ticketTypeDetails, setTicketTypeDetails] = React.useState([]);
  const [ticketTypeDetail, setTicketTypeDetail] = React.useState({
    "service_name": "",
    "description": "",
    "fee_type": "",
    "fee_value": 0,
    "ticket_type": 0 // ID của loại vé tương ứng
  });


  const [seatConfigurations, setSeatConfigurations] = React.useState([]);
  const [seatConfiguration, setSeatConfiguration] = React.useState({
    "position": "",
    "start_seat_number": 1,
    "end_seat_number": 1
  });


  const [errors, setErrors] = React.useState([]);
  const navigate = useNavigate();
  const [taskName, setTaskName] = React.useState("event_input");
  const [selectedItem, setSelectedItem] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState("");


  const addTicketType = () => {
    setTicketTypes([...ticketTypes, ticket_Type]);
    setTicket_Type({
      "ticket_type_name": "",
      "description": "",
      "price": 0,
      "ticket_type_details": [],
      "seat_configurations": [],
    });
  };

  const handleAddService = () => {
    setTicketTypeDetails([...ticketTypeDetails, ticketTypeDetail]);
    setTicketTypeDetail({
      "service_name": "",
      "description": "",
      "fee_type": "",
      "fee_value": 0,
      "ticket_type": 0
    });
  };


  const handleAddSeat = () => {
    // Cập nhật seatConfigurations
    const updatedSeatConfigurations = [...seatConfigurations, seatConfiguration];
    setSeatConfigurations(updatedSeatConfigurations);
    setSeatConfiguration({
      "position": "",
      "start_seat_number": 1,
      "end_seat_number": 1
    });
  };

  React.useEffect(() => {
    setTicket_Type((prevalue) => {
      return {
        ...prevalue,
        seat_configurations: seatConfigurations
      }
    });

    setTicket_Type((prevalue) => {
      return {
        ...prevalue,
        ticket_type_details: ticketTypeDetails
      }
    });
  }, [seatConfigurations,ticketTypeDetails]);

  // Cập nhật ticketTypes sử dụng useEffect
  React.useEffect(() => {
    const updatedTickets = [...ticketTypes];
    for (var i=0; i < updatedTickets.length; i++) {
      if(i === selectedIndex){
        updatedTickets[i] = ticket_Type;
      }
    }
    setTicketTypes(updatedTickets);
    console.log(ticketTypes)
  }, [ticket_Type]);
  
  const handleSelected = (value, index) =>{
    setTicket_Type(value);
    setSelectedIndex(index);
  }

  React.useEffect(() => {setTicketTypeDetails([]);}, [selectedIndex]);

  const handleNextTask = () => {
    if (taskName === "event_input") {
      setTaskName("ticket_type_input")
    } else if (taskName === "ticket_type_input") {
      setTaskName("service_input")
    } else if (taskName === "service_input") {
      setTaskName("seat_class_input")
    }
  }

  const handlePrevTask = () => {
    if (taskName === "ticket_type_input") {
      setTaskName("event_input")
    } else if (taskName === "service_input") {
      setTaskName("ticket_type_input")
    } else if (taskName === "seat_class_input") {
      setTaskName("service_input")
    }
  }

  const handleChange = (event, nameObject) => {
    let value = event.target.value;
    let name = event.target.name;

    if (nameObject === 'event input') {
      setEventInfo((prevalue) => {
        return {
          ...prevalue,
          [name]: value
        }
      })
    } else if (nameObject === 'ticket input') {
      setTicket_Type((prevalue) => {
        return {
          ...prevalue,
          [name]: value
        }
      });


    } else if (nameObject === 'service input') {
      setTicketTypeDetail((prevalue) => {
        return {
          ...prevalue,
          [name]: value
        }
      })
    } else if (nameObject === 'seat input') {
      setSeatConfiguration((prevalue) => {
        return {
          ...prevalue,
          [name]: value
        }
      })
    }
  }

  const handleChangeNumber = (event, nameObject) => {
    const stringValue = event.target.value;
    const sanitizedValue = stringValue.replace(/[^0-9.]/g, ''); // Loại bỏ tất cả ký tự không phải số hoặc dấu chấm
    const value = parseFloat(sanitizedValue);
    let name = event.target.name;

    if (nameObject === 'ticket input') {
      console.log(name, value);   
      setTicket_Type((prevalue) => {
        return {
          ...prevalue,
          [name]: value
        }
      });


    } else if (nameObject === 'service input') {
      setTicketTypeDetail((prevalue) => {
        return {
          ...prevalue,
          [name]: value
        }
      })
    } else if (nameObject === 'seat input') {
      setSeatConfiguration((prevalue) => {
        return {
          ...prevalue,
          [name]: value
        }
      })
    }
  }

  const handleDateChange = (date, name) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const onlyFormattedDate = new Date(formattedDate).toISOString().split('T')[0];
    console.log(onlyFormattedDate);
    setEventInfo((prevValue) => ({
      ...prevValue,
      [name]: onlyFormattedDate
    }));
  }

  const isValidDate = (currentDate) => {
    const selectedDate = currentDate.toDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison
    return selectedDate >= today;
  };

  const onTimeChangeHandler = (val) => {
    setEventInfo((prevValue) => ({
      ...prevValue,
      start_time: val
    }));
  }


  const handleSubmit = () => {
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
    } else {
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

  React.useEffect(() => {
    setEventInfo(prevState => ({
      ...prevState,
      start_time: moment(new Date()).format("HH:mm") // Tính toán giá trị start_time ở đây
    }));
  }, []);
  return (
    <div className="Create_event__wrapper">
      <Header />
      <div className="Create_event">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='Create_event__form'>
          {taskName === 'event_input' &&
            <div className="Create_event__infor_event_input">
              <h2 className="Create_event__infor_event_input--title">Nhập thông tin sự kiện</h2>
              <label htmlFor="event_name" className='Create_event_form__label'>Tên sự kiện</label>
              <input
                type="text"
                id="event_name"
                name="event_name"
                value={eventInfo.event_name}
                onChange={(event) => handleChange(event, 'event input')}
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
                onChange={(event) => handleChange(event, 'event input')}
                placeholder='Nhập mô tả sự kiện'
                className={errors.password ? "Create_event_form__input_description error-input" : "Create_event_form__input_descriptio normal-input"}
                rows={4}
                cols={40}
              />
              <label htmlFor="start_date" className='Create_event_form__label'>Ngày bắt đầu</label>
              <Datetime
                id="start_date"
                name="start_date"
                value={format(eventInfo.start_date, "dd-MM-yyyy")}
                onChange={(date) => handleDateChange(date, 'start_date')}
                dateFormat="DD-MM-YYYY"
                timeFormat={false}
                locale="vi"
                closeOnSelect={true}
                renderMonth={(props, month) => <td {...props}>Thg {month + 1}</td>}
                placeholderText="Chọn ngày bắt đầu"
                isValidDate={isValidDate}
                className={errors.birthday ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              <label htmlFor="end_date" className='Create_event_form__label'>Ngày kết thúc</label>
              <Datetime
                id="end_date"
                name="end_date"
                value={format(eventInfo.end_date, "dd-MM-yyyy")}
                onChange={(date) => handleDateChange(date, 'end_date')}
                dateFormat="DD-MM-YYYY"
                timeFormat={false}
                locale="vi"
                closeOnSelect={true}
                renderMonth={(props, month) => <td {...props}>Thg {month + 1}</td>}
                placeholderText="Chọn ngày kết thúc"
                isValidDate={isValidDate}
                className={errors.birthday ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              <label htmlFor="start_time" className='Create_event_form__label'>Giờ khai mạc</label>
              {/* <TimeInput
                id="start_time"
                name="start_time"
                initTime={eventInfo.start_time}
                className='s-input -time'
                onTimeChange={onTimeChangeHandler}
              /> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker']}>
                  <TimePicker 
                    id="start_time"
                    name="start_time"
                    val= {eventInfo.start_time}
                    onChange={onTimeChangeHandler}
                    className={errors.start_time ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                  />
                </DemoContainer>
              </LocalizationProvider>
              {/* <input 
              type="time" 
              id="start_time"
              name="start_time"
              value={eventInfo.start_time} 
              onChange={handleTimeChange} 
            /> */}
              <label htmlFor="location" className='Create_event_form__label'>Địa điểm</label>
              <input
                type="text"
                id="location"
                name="location"
                value={eventInfo.location}
                onChange={(event) => handleChange(event, 'event input')}
                placeholder='Nhập địa điểm tổ chức'
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              <label htmlFor="banner_url" className='Create_event_form__label'>Banner</label>
              <input
                type="text"
                id="banner_url"
                name="banner_url"
                value={eventInfo.banner_url}
                onChange={(event) => handleChange(event, 'event input')}
                placeholder='Chọn banner'
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              <label htmlFor="event_topics" className='Create_event_form__label'>Chủ đề sự kiện</label>
              <input
                type="text"
                id="event_topics"
                name="event_topics"
                value={eventInfo.event_topics}
                onChange={(event) => handleChange(event, 'event input')}
                placeholder='Chọn chủ đề sự kiện'
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              <button type="button" className='Create_event__form--submit_btn' onClick={handleNextTask}>Tiếp theo</button>
            </div>}
          {taskName === 'ticket_type_input' &&
            <div className="Create_event__ticket_type_input">
              <h2 className="Create_event__ticket_type_input--title">Thêm các loại vé</h2>
              <label htmlFor="ticket_type_name" className='Create_event_form__label'>Tên loại vé</label>
              <input
                type="text"
                id="ticket_type_name"
                name="ticket_type_name"
                value={ticket_Type.ticket_type_name}
                onChange={(event) => handleChange(event, 'ticket input')}
                placeholder='Nhập tên loại vé'
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              {errors["email"] && <span className="error">{errors["email"]}</span>}
              <label htmlFor="ticket_description" className='Create_event_form__label'>Mô tả</label>
              <textarea
                type="text"
                id="ticket_description"
                name="description"
                value={ticket_Type.description}
                onChange={(event) => handleChange(event, 'ticket input')}
                placeholder='Nhập mô tả loại vé'
                className={errors.password ? "Create_event_form__input_description error-input" : "Create_event_form__input_description normal-input"}
                rows={4}
                cols={40}
              />
              <label htmlFor="ticket_price" className='Create_event_form__label'>Giá vé</label>
              {/* <input
                type="text"
                id="ticket_price"
                name="price"
                value={ticket_Type.price}
                onChange={(event) => handleChange(event, 'ticket input')}
                placeholder='Nhập giá vé'
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              /> */}
              <NumericFormat
                id="ticket_price"
                name="price"
                value={ticket_Type.price}
                thousandSeparator = {true}
                customInput={TextField}
                onChange={(event) => handleChangeNumber(event, 'ticket input')}
                placeholder='Nhập giá vé'
                className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              <button type="button" className='Create_event__form--submit_btn' onClick={addTicketType}>Thêm</button>
              <h3 className="List_ticket_type__title">Danh sách các loại vé</h3>
              <div className="form__list">
                {ticketTypes !== null && ticketTypes.map((ticket, index) => {
                  return (<span key={index}> {ticket?.ticket_type_name}</span>);
                })}
              </div>
              <div className="form__btn">
                <button type="button" className='Create_event__form--submit_btn return' onClick={handlePrevTask}>Trở về</button>
                <button type="button" className='Create_event__form--submit_btn' onClick={handleNextTask}>Tiếp theo</button>
              </div>
            </div>}
          {taskName === 'service_input' &&
            <div className='Create_event__service_input'>
              <div className="Create_event__service_input--top">
                <div className="Create_event__ticket_type_list">
                <Table striped bordered hover>

                  <thead>
                    <tr>
                      <th className="title" colSpan={2}>Danh sách các loại vé</th>
                    </tr>
                    <tr>
                      <th className="stt">STT</th>
                      <th>Tên loại vé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketTypes !== null && ticketTypes.map((ticket, index) => {
                      return (
                        <tr  key={index} onClick={() => handleSelected(ticket, index)}>
                          <td className="stt">{index}</td>
                          <td>{ticket?.ticket_type_name}</td>
                        </tr>
                    );
                    })}
                  </tbody>
                </Table>
                
                </div>
                {ticket_Type && 
                <div className="Create_event__service_infor_input">
                  <h2 className="Create_event__service_input--title">Thêm các dịch vụ gia tăng</h2>
                  <label htmlFor="ticket_type_name" className='Create_event_form__label'>Tên hạng vé</label>
                  <input
                    type="text"
                    id="ticket_type_name"
                    name="ticket_type_name"
                    value={ticket_Type?.ticket_type_name}
                    readOnly
                    disabled
                    className={errors.email ? "Create_event_form__input error-input disable" : "Create_event_form__input normal-input disable"}
                  />
                  <label htmlFor="service_name" className='Create_event_form__label'>Tên dịch vụ</label>
                  <input
                    type="text"
                    id="service_name"
                    name="service_name"
                    value={ticketTypeDetail.service_name}
                    onChange={(event) => handleChange(event, 'service input')}
                    placeholder='Nhập tên dịch vụ'
                    className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                  />
                  {errors["email"] && <span className="error">{errors["email"]}</span>}
                  <label htmlFor="description" className='Create_event_form__label'>Mô tả</label>
                  <textarea
                    type="text"
                    id="description"
                    name="description"
                    value={ticketTypeDetail.description}
                    onChange={(event) => handleChange(event, 'service input')}
                    placeholder='Nhập mô tả sự kiện'
                    className={errors.password ? "Create_event_form__input_description error-input" : "Create_event_form__input_descriptio normal-input"}
                    rows={4}
                    cols={40}
                  />
                  <label htmlFor="fee_type" className='Create_event_form__label'>Loại giá dịch vụ</label>
                  <input
                    type="text"
                    id="fee_type"
                    name="fee_type"
                    value={ticketTypeDetail.fee_type}
                    onChange={(event) => handleChange(event, 'service input')}
                    placeholder='Nhập loại giá dịch vụ'
                    className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                  />
                  <label htmlFor="fee_value" className='Create_event_form__label'>Giá dịch vụ</label>
                  {/* <input
                    type="text"
                    id="fee_value"
                    name="fee_value"
                    value={ticketTypeDetail.fee_value}
                    onChange={(event) => handleChange(event, 'service input')}
                    placeholder='Nhập giá dịch vụ'
                    className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                  /> */}
                  <NumericFormat
                    id="fee_value"
                    name="fee_value"
                    value={ticketTypeDetail.fee_value}
                    thousandSeparator = {true}
                    customInput={TextField}
                    onChange={(event) => handleChangeNumber(event, 'service input')}
                    placeholder='Nhập giá vé'
                    className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                  />
                  <button type="button" className='Create_event__form--submit_btn' onClick={handleAddService}>Thêm</button>
                  <h3 className="form__list--title">Danh sách các dịch vụ</h3>
                  <div className="form__list">
                    {ticketTypeDetails !== null && ticketTypeDetails.map((ticket, index) => {
                      return (<span key={index}> {ticket?.service_name}</span>);
                    })}
                  </div>
                </div>
                }
              </div>
              <div className="form__btn">
                <button type="button" className='Create_event__form--submit_btn return' onClick={handlePrevTask}>Trở về</button>
                <button type="button" className='Create_event__form--submit_btn' onClick={handleNextTask}>Tiếp theo</button>
              </div>
            </div>}
          {taskName === 'seat_class_input' &&
            <div className="Create_event__seat_class_input">
              <div className="Create_event__seat_class_input--top">
                <div className="Create_event__ticket_type_list">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th className="title" colSpan={2}>Danh sách các loại vé</th>
                      </tr>
                      <tr>
                        <th className="stt">STT</th>
                        <th>Tên loại vé</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketTypes !== null && ticketTypes.map((ticket, index) => {
                        return (
                          <tr  key={index} onClick={() => handleSelected(ticket, index)}>
                            <td className="stt">{index}</td>
                            <td>{ticket?.ticket_type_name}</td>
                          </tr>
                      );
                      })}
                    </tbody>
                  </Table>
                </div>
                {ticket_Type && 
                  <div className="Create_event__seat_infor_input">
                    <h2 className="Create_event__seat_config_input--title">Thêm các hàng ghế</h2>
                    <label htmlFor="ticket_type_name" className='Create_event_form__label'>Tên hạng vé</label>
                    <input
                      type="text"
                      id="ticket_type_name"
                      name="ticket_type_name"
                      value={ticket_Type?.ticket_type_name}
                      readOnly
                      disabled
                      className={errors.email ? "Create_event_form__input error-input disable" : "Create_event_form__input normal-input disable"}
                    />
                    <label htmlFor="position" className='Create_event_form__label'>Hàng ghế</label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={seatConfiguration.position}
                      onChange={(event) => handleChange(event, 'seat input')}
                      placeholder='Nhập hàng ghế'
                      className={errors.email ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                    />
                    <div className="form__seat_range">
                      <div className="form__start_seat">
                        <label htmlFor="start_seat_number" className='sign_up_form__label'>Số ghế bắt đầu</label>
                        <input
                          type="text"
                          id="start_seat_number"
                          name="start_seat_number"
                          placeholder='Ghế bắt đầu'
                          value={seatConfiguration.start_seat_number}
                          className={errors.first_name ? "form_input_seat error-input" : "form_input_seat normal-input"}
                          onChange={(event) => handleChange(event, 'seat input')}
                          />
                        {errors["first_name"] && <span className="error">{errors["first_name"]}</span>}
                      </div>
                      <div className="form_last_seat">
                        <label htmlFor="end_seat_number" className='sign_up_form__label'>Số ghế kết thúc</label>
                        <input
                          type="text"
                          id="end_seat_number"
                          name="end_seat_number"
                          placeholder='Ghế kết thúc'
                          value={seatConfiguration.end_seat_number}
                          className={errors.last_name ? "form_input_seat error-input" : "form_input_seat normal-input"}
                          onChange={(event) => handleChange(event, 'seat input')}
                        />
                        {errors["last_name"] && <span className="error">{errors["last_name"]}</span>}
                      </div>
                    </div>
                    <button type="button" className='Create_event__form--submit_btn' onClick={handleAddSeat}>Thêm</button>
                    <h3 className="form__list--title">Danh sách các hàng ghế</h3>
                    <div className="form__list_full">
                      {seatConfigurations !== null && 
                      <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th className="title" colSpan={4}>Danh sách các loại vé</th>
                        </tr>
                        <tr>
                          <th className="stt">STT</th>
                          <th>Hàng ghế</th>
                          <th>Ghế bắt đầu</th>
                          <th>Ghế kết thúc</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seatConfigurations.map((seat, index) => {
                          return (
                            <tr  key={index}>
                              <td className="stt">{index + 1}</td>
                              <td>{seat?.position}</td>
                              <td>{seat?.start_seat_number}</td>
                              <td>{seat?.end_seat_number}</td>
                            </tr>
                        );
                        })}
                      </tbody>
                      </Table>}
                    </div>
                  </div>
                }
              </div>
              <div className="form__btn">
                <button type="button" className='Create_event__form--submit_btn return' onClick={handlePrevTask}>Trở về</button>
                <button type="submit" className='Create_event__form--submit_btn' onClick={handleSubmit}>Gửi sự kiện</button>
              </div>
            </div>
          }
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;