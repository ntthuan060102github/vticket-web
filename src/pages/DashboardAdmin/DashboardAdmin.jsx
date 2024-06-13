import React from 'react';
import axios from 'axios';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { format } from 'date-fns';
import moment from 'moment';
import 'moment/locale/vi';
import "chart.js/auto";
import { Line } from "react-chartjs-2";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine} from '@fortawesome/free-solid-svg-icons';
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import './DashboardAdmin.css'
import Header from '../../components/Header';
import Footer from '../../components/Footer';


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

function DashboardAdmin() {
  const [errors, setErrors] = React.useState([]);
  const [taskName, setTaskName] = React.useState("report");
  
  const [eventStatistic, setEventStatistic] = React.useState([]);
  const [statisticArray, setStatisticArray] = React.useState([]);

  const today= new Date();
  const formatted_date = moment(today).format("YYYY-MM-DD");
  const onlyFormatted_date = new Date(formatted_date).toISOString().split('T')[0];
  const [eventAndTime, setEventAndTime] = React.useState({
    "start_date":onlyFormatted_date,
    "end_date":onlyFormatted_date,
  });

  const firstName = localStorage.getItem('first_name');
  const lastName = localStorage.getItem('last_name');
  const avatarURL = localStorage.getItem('avatar_url');

  const isValidStartDateEvent = (currentDate) => {
    const today = moment();
    return currentDate.isBefore(today);
  };

  const isValidEndDateEvent = (currentDate) => {
    const today = moment();
    const tenDaysAfterSelectedDate = eventAndTime.start_date ? moment(eventAndTime.start_date).add(10, 'days') : null;
  
    // Check if eventAndTime.start_date is defined and tenDaysAfterSelectedDate is valid
    if (eventAndTime.start_date && tenDaysAfterSelectedDate) {
      // Find the minimum date among tenDaysAfterSelectedDate, today, and startDate
      const minDate = moment.min(tenDaysAfterSelectedDate, today);
      return currentDate.isBefore(minDate) && currentDate.isAfter(moment(eventAndTime.start_date));
    }
  
    // If eventAndTime.start_date is not defined or tenDaysAfterSelectedDate is not valid, return false
    return false;
  };

  const handleDateEventChange = (date, name) => {
    setErrors([]);
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const onlyFormattedDate = new Date(formattedDate).toISOString().split('T')[0];

    setEventAndTime((prevValue) => ({
      ...prevValue,
      [name]: onlyFormattedDate
    }));
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

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return;
    }
    else {
      axios({
        method: 'get',
        url: `${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/statistic/admin?start_date=${eventAndTime.start_date}&end_date=${eventAndTime.end_date}`,
        data: {
          start_date: eventAndTime.start_date,
          end_date: eventAndTime.end_date,
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
    setStatisticArray(eventStatistic.statistic_by_day);
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
        // {
        //   label: 'Số vé đã bán',
        //   data: dataSold,
        //   borderColor: 'rgb(58,55,193) ',
        //   backgroundColor: 'rgb(241,90,36)',
        // },
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
  },[statisticArray])

  return (
    <div className="Dashboard_admin__wrapper">
      <Header />
      <div className="Dashboard_admin">
        <div className="Dashboard_admin__sidebar">
          <div className="Sidebar__avt_name">
            <img src={avatarURL !== "null" ? avatarURL : "/assets/images/avatar_default.png"} alt="User Avatar" className="Sidebar_avt" />
            <h2 className="Sidebar__name">{firstName} {lastName}</h2>
          </div>
          <ul class="Sidebar__menu">
            {/* <li class={taskName === 'infor' ? "Sidebar__menu--item_active" : "Sidebar__menu--item"} onClick={()=>setTaskName('infor')}>
              <FontAwesomeIcon icon={faUser} className="task_icon" />
              Thông tin cá nhân</li> */}
            <li class={taskName === 'report' ? "Sidebar__menu--item_active" : "Sidebar__menu--item"} onClick={()=>setTaskName('report')}>
              <FontAwesomeIcon icon={faChartLine} className="task_icon" />
              Thống kê doanh thu</li>
          </ul>
        </div>
        {taskName === 'report' && <div className="Dashboard_admin__report">
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
              {eventStatistic.length !== 0 && <Line options={options} data={dataLineChart} />}
            </div> 
          </div>}
      </div>
      <Footer/>
    </div>
  );
}

export default DashboardAdmin;