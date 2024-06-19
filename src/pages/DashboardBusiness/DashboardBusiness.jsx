import React from 'react';
import axios from 'axios';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { format } from 'date-fns';
import moment from 'moment';
import 'moment/locale/vi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faHeadset, faPencil, faPlus, faTableList, faUser } from '@fortawesome/free-solid-svg-icons';
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import './DashboardBusiness.css'
import Header from '../../components/Header';
import { Form, Modal, Table } from 'react-bootstrap';
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';


export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Thống kê doanh thu',
    },
  },
};

function DashboardBusiness() {

  const [errors, setErrors] = React.useState([]);

  const [changedIndex, setChangedIndex] = React.useState(0);
  const [changedInfo, setChangedInfo] = React.useState(false);
  const [taskName, setTaskName] = React.useState("infor");
  const [events, setEvents] = React.useState([]);
  const [eventsPagination, setEventsPagination] = React.useState([]);
  const [supports, setSupports] = React.useState([]);
  const [event, setEvent] = React.useState([]);
  const [eventStatistic, setEventStatistic] = React.useState([]);
  const [statisticArray, setStatisticArray] = React.useState([]);

  const today= new Date();
  const formatted_date = moment(today).format("YYYY-MM-DD");
  const onlyFormatted_date = new Date(formatted_date).toISOString().split('T')[0];
  const [eventAndTime, setEventAndTime] = React.useState({
    "start_date":onlyFormatted_date,
    "end_date":onlyFormatted_date,
    "id":"",
  });


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

  React.useEffect(()=>{
    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/event`, {
    })
    .then(function (response) {
        if (response.data.status === 1) {
            setEvents(response.data?.data);
        }
    })
  },[]);

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

  const handleDateEventChange = (date, name) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const onlyFormattedDate = new Date(formattedDate).toISOString().split('T')[0];

    setEventAndTime((prevValue) => ({
      ...prevValue,
      [name]: onlyFormattedDate
    }));
  }

  const isValidDate = (currentDate) => {
    const selectedDate = currentDate.toDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison
    return selectedDate <= today;
  };

  const isValidStartDateEvent = (currentDate) => {
    const today = moment();
    const startDate = moment(event.start_date);

    if (startDate.isBefore(today)) {
      return currentDate.isBefore(startDate);
    } else {
      return currentDate.isBefore(today);
    }
  };

  const isValidEndDateEvent = (currentDate) => {
    const today = moment();
    const startDate = moment(event.start_date);
    const tenDaysAfterSelectedDate = eventAndTime.start_date ? moment(eventAndTime.start_date).add(10, 'days') : null;
  
    // Check if eventAndTime.start_date is defined and tenDaysAfterSelectedDate is valid
    if (eventAndTime.start_date && tenDaysAfterSelectedDate) {
      // Find the minimum date among tenDaysAfterSelectedDate, today, and startDate
      const minDate = moment.min(tenDaysAfterSelectedDate, today, startDate);
      return currentDate.isBefore(minDate) && currentDate.isAfter(moment(eventAndTime.start_date));
    }
  
    // If eventAndTime.start_date is not defined or tenDaysAfterSelectedDate is not valid, return false
    return false;
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
        last_name: accountInfo.last_name,
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
            setChangedInfo(true);
            setTimeout(() => {
              setChangedInfo(false);
            }, 1500);
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

  const handleEventIDChange = (e) =>{
    const eventId = parseInt(e.target.value);
    setEventAndTime((prev)=>({
      ...prev,
      'id': eventId,
    }))
    for(let i =0 ; i < events.length; i++){
      if(events[i].id === eventId){
        setEvent(events[i]);
      }
    }
  }

  const handleSeeRevenue = () =>{   
    const newErrors = {};
    setErrors([]);

    if (!eventAndTime.start_date) {
      newErrors["revenue_start_date"] = "Ngày bắt đầu không được trống";
    }

    if (!eventAndTime.end_date) {
      newErrors["revenue_end_date"] = "Ngày kết thúc không được trống";
    }

    if (!eventAndTime.id) {
      newErrors["revenue_id"] = "Vui lòng chọn sự kiện để xem thống kê doanh thu";
    }

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return;
    }
    else {
      axios({
        method: 'get',
        url: `${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/statistic/${eventAndTime.id}/event?start_date=${eventAndTime.start_date}&end_date=${eventAndTime.end_date}`,
        data: {
          start_date: eventAndTime.start_date,
          end_date: eventAndTime.end_date,
          id: eventAndTime.id,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(function (response) {
          if (response.data.status === 1) {
            setEventStatistic(response.data.data);
          }
        })
    }
  }
  

  const [formattedNumberRevenue, setFormattedNumberRevenue] = React.useState(0); 

  const labels = [];
  const dataSold = [];
  const dataRevenue = [];
  
  const [dataLineChart, setDataLineChart] = React.useState({});

  React.useEffect(()=>{
    setStatisticArray(eventStatistic.statistic);
    if(eventStatistic.total_revenue){
      setFormattedNumberRevenue(eventStatistic.total_revenue.toLocaleString('en-US'));
    }
  },[eventStatistic])

  React.useEffect(()=>{
    if(statisticArray && statisticArray.length > 0) {
      for(var i = 1; i< statisticArray.length; i++){
        labels.push(statisticArray[i].date);
        dataSold.push(statisticArray[i].ticket_sold);
        dataRevenue.push(statisticArray[i].revenue);
      }
    }

    
    const data_line_chart = {
      labels: labels,
      datasets: [
        {
          label: 'Số tiền giao dịch',
          data: dataRevenue,
          borderWidth: 2,
          hoverBackgroundColor: 'rgba(75,192,192,0.4)',
          hoverBorderColor: 'rgba(75,192,192,1)',
          borderColor: 'rgb(58,55,193) ',
          backgroundColor: 'rgb(241,90,36)',
        }
      ],
    };

    setDataLineChart(data_line_chart);
  },[statisticArray]);


  const [currentPage, setCurrentPage] = React.useState(0);
  const [currentSupportPage, setCurrentSupportPage] = React.useState(0);
  const eventsPerPage = 10;
  const supportsPerPage = 10;

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    setCurrentSupportPage(data.selected);
  };

  // const offset = currentPage * eventsPerPage;
  // const offsetSupport = currentSupportPage * supportsPerPage;
  // const currentEvents = events.slice(offset, offset + eventsPerPage);
  // const currentSupports = supports.slice(offset, offset + supportsPerPage);
  // const pageCount = Math.ceil(events.length / eventsPerPage);
  // const pageSupportCount = Math.ceil(supports.length / supportsPerPage);

  const [showResponse, setShowResponse] = React.useState(false);
  const [sendResponse, setSendResponse] = React.useState(false);
  const [responseSupport, setResponseSupport] = React.useState(
    {
      "content":"",
      "request": "",
    }
  )
  const handleShowResponse = (id) => {
    setShowResponse(true);
    setResponseSupport((prev) => ({
      ...prev,
      "request": id,
    }))
  };

  const handleCloseResponse = () => setShowResponse(false);
  const handleChangeResonse = (e) =>{
    let value = e.target.value;
    setResponseSupport((prev)=>({
      ...prev,
      "content": value,
    }))
  };

  const handleSendResponse = () =>{
    axios({
        method: 'post',
        url: `${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/support-response`,
        data: {
          content: responseSupport.content,
          request: responseSupport.request,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(function (response) {
          console.log(response);
          if (response.data.status === 1) {
            setResponseSupport(
              {
                "content":"",
                "request": "",
              }
            );
            setSendResponse(true);
            setTimeout(() => {
              setSendResponse(false);
            }, 1500);
            setTimeout(() => {
              setShowResponse(false);
            }, 2000);
          }
        })
  }

  const [pageNumSupport, setPageNumSupport] = React.useState(1);
  const [pageNumEvent, setPageNumEvent] = React.useState(1);
  const [pageSizeSupport, setPageSizeSupport] = React.useState(10);
  const [pageSizeEvent, setPageSizeEvent] = React.useState(10);
  const [numPagesSupport, setNumPagesSupport] = React.useState(2);
  const [numPagesEvent, setNumPagesEvent] = React.useState(2);

  React.useEffect(() => {
    fetchEvents();
  }, [pageNumEvent, pageSizeEvent]);

  React.useEffect(() => {
    fetchSupports();
  }, [pageNumSupport, pageSizeSupport]);

  const fetchEvents = async () => {
    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/event?page_num=${pageNumEvent}&page_size=${pageSizeEvent}`, {
      page_num: pageNumEvent,
      page_size: pageSizeEvent,
    })
    .then(function (response) {
      console.log(response);
      if (response.data.status === 1) {
        setEventsPagination(response.data.data?.data);
        setNumPagesEvent(response.data.data?.num_pages);
      }
    })
  };

  const fetchSupports = async () => {
    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/support-request`, {
    }).then(function (response) {
      console.log(response);
      if (response.data.status === 1) {
        setSupports(response.data.data);
        // setNumPagesSupport(response.data.data?.num_pages);
      }
    })
  };

  const handleEventPageChange = (newPageNum) => {
    setPageNumEvent(newPageNum);
  };

  const handlePrevPageEvent = () => {
    if(pageNumEvent - 1 > 0)
    {
      setPageNumEvent(pageNumEvent - 1);
    }
  };
  const handleNextPageEvent = () => {
    if(pageNumEvent + 1 <= numPagesEvent)
    {
      setPageNumEvent(pageNumEvent + 1);
    }
  };

  const handleSupportPageChange = (newPageNum) => {
    setPageNumSupport(newPageNum);
  };

  const handlePrevPageSupport = () => {
    if(pageNumSupport - 1 > 0)
    {
      setPageNumSupport(pageNumSupport - 1);
    }
  };
  const handleNextPageSupport = () => {
    if(pageNumSupport + 1 <= numPagesSupport)
    {
      setPageNumSupport(pageNumSupport + 1);
    }
  };

  return (
    <div className="Dashboard_business__wrapper">
      <Header />
      <div className="Dashboard_business">
        <div className="Dashboard_business__sidebar">
          <div className="Sidebar__avt_name">
            <img src={accountInfo.avatar_url ? accountInfo.avatar_url : "/assets/images/avatar_default.png"} alt="User Avatar" className="Sidebar_avt" />
            <h2 className="Sidebar__name">{firstName} {lastName}</h2>
          </div>
          <ul class="Sidebar__menu">
            <li class={taskName === 'infor' ? "Sidebar__menu--item_active" : "Sidebar__menu--item"} onClick={()=>setTaskName('infor')}>
              <FontAwesomeIcon icon={faUser} className="task_icon" />
              Thông tin cá nhân</li>
            <li class={taskName === 'report' ? "Sidebar__menu--item_active" : "Sidebar__menu--item"} onClick={()=>setTaskName('report')}>
              <FontAwesomeIcon icon={faChartLine} className="task_icon" />
              Thống kê doanh thu</li>
            <li class={taskName === 'event management' ? "Sidebar__menu--item_active" : "Sidebar__menu--item"} onClick={()=>setTaskName('event management')}>
            <FontAwesomeIcon icon={faTableList} className="task_icon" />
            Quản lý sự kiện</li>
            <li class={taskName === 'support' ? "Sidebar__menu--item_active" : "Sidebar__menu--item"} onClick={()=>setTaskName('support')}>
            <FontAwesomeIcon icon={faHeadset} className="task_icon" />
            Hổ trợ</li>
          </ul>
        </div>
        {taskName === 'infor' && <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='Dashboard_business__form'>
          <h2 className="Dashboard_business__infor_input--title">Thông tin doanh nghiệp</h2>
          <div className="Dashboard_business__infor_input">    
            <div className='Dashboard_business__avatar'>
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
            </div>
            <div className="Dashboard_business_form__full_name">
              <div className="form_first_name">
                <label htmlFor="first_name" className='Dashboard_business_form__label'>Họ</label>
                <input
                  type="text"
                  id="first_name"
                  value={accountInfo.first_name}
                  name="first_name"
                  className={errors.first_name ? "Dashboard_business_form__input_name error-input" : "Dashboard_business_form__input_name normal-input"}
                  onChange={handleChange} />
                {errors["first_name"] && <span className="business_error">{errors["first_name"]}</span>}
              </div>
              <div className="form_last_name">
                <label htmlFor="last_name" className='Dashboard_business_form__label'>Tên</label>
                <input
                  type="text"
                  id="last_name"
                  value={accountInfo.last_name}
                  name="last_name"
                  className={errors.last_name ? "Dashboard_business_form__input_name error-input" : "Dashboard_business_form__input_name normal-input"}
                  onChange={handleChange}
                />
                {errors["last_name"] && <span className="business_error">{errors["last_name"]}</span>}
              </div>
            </div>
            <label htmlFor="gender" className='Dashboard_business_form__label'>Giới tính</label>
            <select
              name="gender"
              className='Dashboard_business_form__input'
              value={accountInfo.gender}
              onChange={handleChange} >
              <option value="1">Nam</option>
              <option value="0">Nữ</option>
              <option value="-1">Riêng tư</option>
            </select>
            <label htmlFor="birthday" className='Dashboard_business_form__label'>Ngày sinh</label>
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
              className={errors.birthday ? "Dashboard_business_form__input_date error-input" : "Dashboard_business_form__input_date normal-input"}
            />
            {errors["birthday"] && <span className="business_error">{errors["birthday"]}</span>}
            <label htmlFor="phone_number" className='Dashboard_business_form__label'>SĐT</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={accountInfo.phone_number !== 'null' ? accountInfo.phone_number : ''}
              onChange={handleChange}
              className={errors.phone_number ? "Dashboard_business_form__input error-input" : "Dashboard_business_form__input normal-input"} />
            {errors["phone_number"] && <span className="business_error">{errors["phone_number"]}</span>}
            {changedInfo && <span className="successful">
              Cập nhật thông tin tài khoản thành công!
            </span>}
            <button className='Dashboard_business__form--submit_btn' onClick={handleSubmit}>Lưu</button>
          </div>
        </form>}
        {taskName === 'report' && <div className="Dashboard_business__report">
            {/* <h2 className="Dashboard_business__report--title">Thống kê doanh thu</h2>   */}
            <div className="Report_data">
              <div className="Total_ticket_solds">
                <span className="transaction_amount">{eventStatistic.total_ticket_sold || 0}</span>
                <span className="transaction_title">Vé đã bán</span>
              </div>
              <div className="Total_transaction">
                <span className="transaction_amount">{formattedNumberRevenue || 0} VND</span>
                <span className="transaction_title">Tổng doanh thu</span>
              </div>
            </div> 
            <div className="Select_event_time">
              <Form.Group 
                controlId="eventIDSelect" 
                className='Select_event'
              >
                <Form.Label>Chọn sự kiện</Form.Label>
                <Form.Control 
                  as="select" 
                  onChange={handleEventIDChange} 
                  className={errors["revenue_id"] ? 'error-input' : 'normal-input'}>
                  <option value="">Chọn sự kiện...</option>
                  {events && events.length > 0 ? (
                    events.map(eventItem => (
                      <option key={eventItem?.id} value={eventItem?.id}>{eventItem?.name}</option>
                    ))
                  ) : (
                    <option disabled>Không có sự kiện</option>
                  )}
                </Form.Control>
              </Form.Group>
              {errors["revenue_id"] && <span className="business_error">{errors["revenue_id"]}</span>}
              <div className="Select_time">
                <div className='Select_start_date'>
                  <label htmlFor="start_date" className='Dashboard_business_form__label'>Ngày bắt đầu</label>
                  <Datetime
                    id="start_date"
                    value={format(eventAndTime.start_date, "dd-MM-yyyy")}
                    onChange={(date) => handleDateEventChange(date,"start_date")}
                    dateFormat="DD-MM-YYYY"
                    timeFormat={false}
                    locale="vi"
                    closeOnSelect={true}
                    renderMonth={(props, month) => <td {...props}>Thg {month + 1}</td>}
                    placeholderText="Chọn ngày sinh"
                    isValidDate={isValidStartDateEvent}
                    className={errors.revenue_start_date ? "Dashboard_business_form__input_date error-input" : "Dashboard_business_form__input_date normal-input"}
                  />
                  {errors["revenue_start_date"] && <span className="business_error">{errors["revenue_start_date"]}</span>}
                </div>
                <div className='Select_start_date'>
                  <label htmlFor="end_date" className='Dashboard_business_form__label'>Ngày kết thúc</label>
                  <Datetime
                    id="end_date"
                    value={format(eventAndTime.end_date, "dd-MM-yyyy")}
                    onChange={(date) => handleDateEventChange(date,"end_date")}
                    dateFormat="DD-MM-YYYY"
                    timeFormat={false}
                    locale="vi"
                    closeOnSelect={true}
                    renderMonth={(props, month) => <td {...props}>Thg {month + 1}</td>}
                    placeholderText="Chọn ngày sinh"
                    isValidDate={isValidEndDateEvent}
                    className={errors.revenue_end_date ? "Dashboard_business_form__input_date error-input" : "Dashboard_business_form__input_date normal-input"}
                  />
                  {errors["revenue_end_date"] && <span className="business_error">{errors["revenue_end_date"]}</span>}
                </div>
              </div>
              <button className="See_revenue" onClick={handleSeeRevenue}>Xem thống kê doanh thu</button>
            </div>
            <div className="Report_chart_line">
              {eventStatistic.length !== 0  && <Line options={options} data={dataLineChart} />}
            </div> 
          </div>}
        {taskName === 'event management' && <div className="Dashboard_business__event_management">
          <h2 className="Dashboard_business__event_management--title">Quản lý sự kiện</h2>  
          <div className="Send_event_btn__wrapper">
            <Link to='/create-event' className="Send_event_btn">
                <FontAwesomeIcon icon={faPlus} className="icon_plus"/>
                Gửi sự kiện
            </Link>
          </div>
          <div className='Dashboard_business__event_management--table'>
            <Table striped bordered hover className='custome_table'>
              <thead>
                <tr className='table__title'>
                  <th className="stt">STT</th>
                  <th className='eventNameTitle'>Tên sự kiện</th>
                  <th>Xem chi tiết</th>
                  <th>Tạo mã giảm giá</th>
                  <th>Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody>
                {eventsPagination !== null && eventsPagination.map((event, index) => {
                  return (
                    <tr key={event.id}  className={`table__content_${index + 1}`}>
                      <td className="stt">{(pageNumEvent - 1) * pageSizeEvent + index + 1}</td>
                      <td className='eventNameContent'>{event?.name}</td>
                      <td>
                        <Link to={`/event-detail/${event.id}`} className="EventDetail__btn">
                          Xem chi tiết
                        </Link>
                      </td>
                      <td>
                        <Link to={"/create-discount"} state={{eventID : event.id}} className="EventDetail__btn">
                          Tạo mã giảm giá
                        </Link>
                      </td>
                      <td>
                        <Link to={"/update-event"} state={{eventID : event.id}} className="EventDetail__btn">
                          Chỉnh sửa
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div className="pagination_events">
            <button className="pagination__previous" onClick={handlePrevPageEvent}>← Quay lại</button>
            {numPagesEvent !== 0 && Array(numPagesEvent).fill(0).map((_, index) => (
              <button key={index} onClick={() => handleEventPageChange(index + 1)} className={(index + 1) === pageNumEvent ? 'pagination__page_num--active' : 'pagination__page_num--unactive'}>
                {index + 1}
              </button>))}
            <button className="pagination__previous" onClick={handleNextPageEvent}>Tiếp theo →</button>
          </div>      
        </div>}
        {taskName === 'support' && <div className="Dashboard_business__support">
          <h2 className="Dashboard_business__support--title">Hổ trợ</h2>  
          <div className='Dashboard_business__support--table'>
            <Table striped bordered hover className='custome_table'>
              <thead>
                <tr className='table__title'>
                  <th className="stt">STT</th>
                  <th className='eventNameTitle_support'>Tên sự kiện</th>
                  <th>Tiêu đề</th>
                  <th>Nội dung</th>
                  <th>Phản hồi</th>
                </tr>
              </thead>
              <tbody>
                {supports !== null && supports.map((support, index) => {
                  return (
                    <tr key={support.id}  className={`table__content_${index + 1}`}>
                      <td className="stt">{(pageNumSupport - 1) * pageSizeSupport + index + 1}</td>
                      <td className='eventNameContent_support'></td>
                      <td>{support?.title}</td>
                      <td>{support?.content}</td>
                      <td>
                        <button className="Response_support_btn" onClick={() => handleShowResponse(support.id)}>
                          Phản hồi
                        </button>
                        <Modal show={showResponse} onHide={handleCloseResponse} size="xl">
                          <Modal.Header closeButton>
                            <Modal.Title>Phản hồi đánh giá</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className='response_support_wrapper'>
                              <label htmlFor="content" className='support_form__label'>Nội dung phản hồi</label>
                              <textarea
                                type="text"
                                id="content"
                                value={responseSupport.content}
                                name="content"
                                placeholder='Nhập nội dung...'
                                className={errors.support_response_content ? "support_form__input error-input" : "support_form__input normal-input"}
                                onChange={(e) => handleChangeResonse(e)} 
                                rows={4}
                                cols={40}
                              />
                              {errors["support_response_content"] && <span className="error">{errors["support_response_content"]}</span>}
                            </div>
                            <div className='Response_support_send_btn__wrapper'>
                              {sendResponse && <span className="successful">
                                Gửi phản hồi thành công!
                              </span>}
                              <button className="Response_support_send_btn" onClick={() => handleSendResponse()}>
                                Gửi phản hồi
                              </button>
                            </div>
                          </Modal.Body>
                        </Modal>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div className="pagination_supports">
            <button className="pagination__previous" onClick={handlePrevPageSupport}>← Quay lại</button>
            {numPagesSupport !== 0 && Array(numPagesSupport).fill(0).map((_, index) => (
              <button key={index} onClick={() => handleSupportPageChange(index + 1)} className={(index + 1) === pageNumSupport ? 'pagination__page_num--active' : 'pagination__page_num--unactive'}>
                {index + 1}
              </button>))}
            <button className="pagination__previous" onClick={handleNextPageSupport}>Tiếp theo →</button>
          </div> 
        </div>}
      </div>
      <Footer/>
    </div>
  );
}

export default DashboardBusiness;