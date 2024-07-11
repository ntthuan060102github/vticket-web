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
import { faChartLine, faDesktop, faPeopleGroup} from '@fortawesome/free-solid-svg-icons';
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import './DashboardAdmin.css'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';


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
  const [taskName, setTaskName] = React.useState("system monitoring");
  
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
    console.log(1);  
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
          console.log(response);
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
      for(var i = 0; i< statisticArray.length; i++){
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
  },[statisticArray]);

  const [users, setUsers] = React.useState([{}]);

  // const [currentPage, setCurrentPage] = React.useState(1);
  // const [pageCount, setPageCount] = React.useState(currentPage + 1);
  // const usersPerPage = 10;

  // const handlePageClick = (data) => {
  //   setCurrentPage(data.selected);
  //   setPageCount(data.selected);
  // };

  // const offset = (currentPage - 1) * usersPerPage;

  const [blockUser, setBlockUser] = React.useState(false);
  const [unlockUser, setUnlockUser] = React.useState(false);

  const [pageNum, setPageNum] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [numPages, setNumPages] = React.useState(0);

  React.useEffect(() => {
    fetchUsers();
  }, [pageNum, pageSize, blockUser, unlockUser]);

  const fetchUsers = async () => {
    axios({
      method: 'get',
      url: `${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/user?page_num=${pageNum}&page_size=${pageSize}`,
      data: {
        page_num: pageNum,
        page_size: pageSize,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      console.log(response);
      if (response.data.status === 1) {
        setUsers(response.data.data?.data);
        setNumPages(response.data.data?.num_pages);
      }
    })
  };

  const handlePageChange = (newPageNum) => {
    setPageNum(newPageNum);
  };

  const handlePrevPage = () => {
    if(pageNum - 1 > 0)
    {
      setPageNum(pageNum - 1);
    }
  };
  const handleNextPage = () => {
    if(pageNum + 1 <= numPages)
    {
      setPageNum(pageNum + 1);
    }
  };



  // React.useEffect(()=>{
  //   axios.get(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/user?page_num=${currentPage}&page_size=${usersPerPage}`, {
  //     page_num: currentPage,
  //     page_size: usersPerPage,
  //   })
  //   .then(function (response) {
  //     console.log(response);
  //     if (response.data.status === 1) {
  //       setUsers(response.data.data.data);
  //     }
  //   })
  // },[blockUser, unlockUser, currentPage]);

  const handleBlockUser = (id) =>{
    axios.get(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/user/${id}/lock`, {
    })
    .then(function (response) {
      console.log(response);
      if (response.data.status === 1) {
        setBlockUser(true);
        setTimeout(() => {
          setBlockUser(false);
        }, 1500);
      }
    })
  };

  const handleUnblockUser = (id) =>{
    axios.get(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/user/${id}/unlock`, {
    })
    .then(function (response) {
      console.log(response);
      if (response.data.status === 1) {
        setUnlockUser(true);
        setTimeout(() => {
          setUnlockUser(false);
        }, 1500);
      }
    })
  };

  

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
            <li class={taskName === 'system monitoring' ? "Sidebar__menu--item_active" : "Sidebar__menu--item"} onClick={()=>setTaskName('system monitoring')}>
              <FontAwesomeIcon icon={faDesktop} className="task_icon" />
              Giám sát hệ thống</li>
            <li class={taskName === 'report' ? "Sidebar__menu--item_active" : "Sidebar__menu--item"} onClick={()=>setTaskName('report')}>
              <FontAwesomeIcon icon={faChartLine} className="task_icon" />
              Thống kê doanh thu</li>
            <li class={taskName === 'user management' ? "Sidebar__menu--item_active" : "Sidebar__menu--item"} onClick={()=>setTaskName('user management')}>
              <FontAwesomeIcon icon={faPeopleGroup} className="task_icon" />
              Quản lý tài khoản</li>
          </ul>
        </div>
        {taskName === 'system monitoring' && <div className="Dashboard_admin__system_monitoring">
          <iframe
            className='system_monitoring__content'
            src="https://4448jllf.status.cron-job.org/">
          </iframe>
          </div>}
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
                  <label htmlFor="start_date" className='Dashboard_admin_form__label'>Ngày bắt đầu</label>
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
                    className={errors.revenue_start_date ? "Dashboard_admin_form__input_date error-input" : "Dashboard_admin_form__input_date normal-input"}
                  />
                  {errors["revenue_start_date"] && <span className="admin_error">{errors["revenue_start_date"]}</span>}
                </div>
                <div className='Select_start_date'>
                  <label htmlFor="end_date" className='Dashboard_admin_form__label'>Ngày kết thúc</label>
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
                    className={errors.revenue_end_date ? "Dashboard_admin_form__input_date error-input" : "Dashboard_admin_form__input_date normal-input"}
                  />
                  {errors["revenue_end_date"] && <span className="admin_error">{errors["revenue_end_date"]}</span>}
                </div>
              </div>
              <button className="See_revenue" onClick={handleSeeRevenue}>Xem thống kê doanh thu</button>
            </div>
            <div className="Report_chart_line">
              {eventStatistic.length !== 0 && <Line options={options} data={dataLineChart} />}
            </div> 
          </div>}
        {taskName === 'user management' && <div className="Dashboard_admin__user_management">
        <h2 className="Dashboard_admin__user_management--title">Quản lý tài khoản</h2>  
        <div className='Dashboard_admin__user_management--table'>
          <Table striped bordered hover className='custome_table'>
            <thead>
              <tr className='table__title'>
                <th className="stt">STT</th>
                <th className='lastNameTitle'>Họ</th>
                <th className='firstNameTitle'>Tên</th>
                <th className='table_email'>Email</th>
                <th className='table_status'>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users && users.map((User, index) => {
                let status = "";
                let class_name_status =  User.status;
                if(User.status === 'ACTIVED'){
                  status = "Đang hoạt động";
                }else if(User.status === "UNVERIFIED"){
                  status = "Chưa kích hoạt";
                }else{
                  status = "Đã khóa";
                }
                return (
                  <tr key={User.id}  className={`table__content_${index + 1}`}>
                    <td className="stt">{(pageNum - 1) * pageSize + index + 1}</td>
                    <td className='lastNameContent'>{User?.first_name}</td>
                    <td className='firstNameContent'>{User?.last_name}</td>
                    <td className='table_email'>{User?.email}</td>
                    <td className={`${class_name_status} table_status`}>{status}</td>
                    <td>
                      {User.status === 'ACTIVED' && <button className="user_block_btn" onClick={() => handleBlockUser(User.id)}>
                        Khóa tài khoản
                      </button>}
                      {/* {User.status === 'UNVERIFIED' && <Link to={`/OTP/${User?.email}`} className="user_verify_btn">
                        Kích hoạt tài khoản
                      </Link>} */}
                      {User.status === 'BLOCKED' && <button className="user_unblock_btn" onClick={() => handleUnblockUser(User.id)}>
                        Mở khóa tài khoản
                      </button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        {blockUser && <span className="successful">
            Khóa tài khoản thành công!
          </span>}
        {unlockUser && <span className="successful">
          Mở khóa tài khoản thành công!
        </span>}
        <div className="pagination_users">
        <button className="pagination__previous" onClick={handlePrevPage}>← Quay lại</button>
        {numPages !== 0 && Array(numPages).fill(0).map((_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)} className={(index + 1) === pageNum ? 'pagination__page_num--active' : 'pagination__page_num--unactive'}>
            {index + 1}
          </button>))}
        <button className="pagination__previous" onClick={handleNextPage}>Tiếp theo →</button>
        </div>
        {/* <ReactPaginate
          previousLabel={'← Quay lại'}
          nextLabel={'Tiếp theo →'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        /> */}
        
        </div>}
      </div>
      <Footer/>
    </div>
  );
}

export default DashboardAdmin;