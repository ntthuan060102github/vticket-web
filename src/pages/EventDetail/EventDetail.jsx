import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCalendarDays, faClock, faEye, faHandHoldingDollar, faLocationDot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import TicketSelectionForm from '../../components/TicketSelectionForm';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// // Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperCore from 'swiper';
// // import required modules
import { Autoplay, EffectCards } from 'swiper/modules';

// import style css
import './EventDetail.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// import component
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import Header from '../../components/Header';
import NavTopCus from '../../components/NavTopCus';
import axios from 'axios';
import Footer from '../../components/Footer';
import { useParams } from 'react-router-dom';

SwiperCore.use([EffectCards]);

function EventDetail() {
  let { slug } = useParams();
  const [errors, setErrors] = React.useState({});
  const [eventDetail, setEventDetail] = React.useState({
    "id": "",
    "ticket_types": [],
    "event_topics": [],
    "name": "",
    "description": "",
    "start_date": "",
    "end_date": "",
    "start_time": "",
    "location": "",
    "banner_url": ""
  });
  // const [banners, setBanners] = React.useState([
  //   {
  //     banner_url: '/assets/images/vuon-chau-au.jpg'
  //   }
  // ])
  // // const [outstandingEvents, setOutstandingEvents] = React.useState([])
  const [upcomingEvents, setUpcomingEvents] = React.useState([{
        "id": 5,
        "name": "Ngày môi trường thế giới",
        "description": "Chương trình kỷ niệm Ngày Môi trường Thế giới",
        "start_date": "2024-06-10",
        "end_date": "2024-07-01",
        "start_time": "10:00:00",
        "location": "Công viên thành phố",
        "banner_url": null,
        "created_at": "2024-05-09T13:09:40.890948Z",
        "event_topic": []
      },
      {
        "id": 7,
        "name": "Dọn dẹp bãi biển",
        "description": "Hoạt động dọn dẹp môi trường tại bãi biển",
        "start_date": "2024-07-15",
        "end_date": "2024-07-01",
        "start_time": "08:00:00",
        "location": "Bãi biển xanh",
        "banner_url": null,
        "created_at": "2024-05-16T13:09:40.890948Z",
        "event_topic": []
      }])
  // const [topicTypes, setTopicTypes] =React.useState([])
  const [showModal, setShowModal] = React.useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  React.useEffect(() => {
    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/event/${slug}`, {
    })
    .then(function (response) {
      if (response.data.status === 1) {                        
        setEventDetail((prev)=>{
          return {
            ...prev,
            id: response.data.data.event.id,
            ticket_types: response.data.data.event.ticket_types,
            event_topics: response.data.data.event.event_topic,
            name: response.data.data.event.name,
            description: response.data.data.event.description,
            start_date: response.data.data.event.start_date,
            end_date: response.data.data.event.end_date,
            start_time: response.data.data.event.start_time.slice(0, 5),
            location: response.data.data.event.location,
            banner_url: response.data.data.event.banner_url
          }
        })
      } else { 
        setErrors((prevalue) => {
          return {
            ...prevalue,
            get_event_topic_data_error: response.data.message
          }
        });
      }
    })
    .catch(function (error) {
      setErrors((prevalue) => {
        return {
          ...prevalue,
          get_event_topic_error: error
        }
      });
    });
  }, []);

  let year, month, day;
  if (eventDetail.start_date && eventDetail.start_date.includes('-')) {
    [year, month, day] = eventDetail.start_date.split('-');
  }

  return (
    <div className="EventDetail__wrapper">
      <Header/>
      <NavTopCus/>
      <div className="EventDetail__slide">
        <Swiper
          spaceBetween={40}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={false}
          modules={[Autoplay]}
          className="mySwiper-top"
        >
          <SwiperSlide>
            <img src={eventDetail?.banner_url} alt={'event banner'} className="banner__img" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="EventDetail__demo">
        <div className='EventDetail__demo--wrapper'>
          <div className="EventDetail__demo--top">
            <h2 className="EventDetail__demo--title">{eventDetail?.name}</h2>
            <button className="EventDetail__demo--buy_now" onClick={handleShow}>
              Mua ngay
              <FontAwesomeIcon icon={faPaperPlane} className="icon_buy_now"/>
            </button>
            <Modal show={showModal} onHide={handleClose} size="xl">
              <Modal.Header closeButton>
                <Modal.Title>Mua vé</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <TicketSelectionForm event={eventDetail} />
              </Modal.Body>
            </Modal>
          </div>
          <div className="EventDetail__demo--container">
            <span className="EventDetail__demo--infor">
              <FontAwesomeIcon icon={faClock} className="icon_infor"/>
              {eventDetail?.start_time}
            </span>
            <span className="EventDetail__demo--infor">
              <FontAwesomeIcon icon={faCalendarDays} className="icon_infor"/>
              Ngày {day} Tháng {month} Năm {year}
            </span>
            <span className="EventDetail__demo--infor">
              <FontAwesomeIcon icon={faLocationDot} className="icon_infor"/>
              {eventDetail.location}
            </span>
          </div>
        </div>
      </div>
      <div className="EventDetail__detail">
        <div className='EventDetail__detail--wrapper'>
            <h2 className="EventDetail__detail--title">Giới thiệu về sự kiện</h2>
            <span className="EventDetail__detail--description">{eventDetail.description}</span>
        </div>
      </div>
      <div className="EventDetail__product_infor">
        <div className='EventDetail__product_infor--wrapper'>
            <h2 className="EventDetail__product_infor--title">Thông tin sản phẩm</h2>
            {eventDetail.ticket_types.map((ticketType)=>{
              let formattedNumber = ticketType.price.toLocaleString('en-US'); 
              return(
                <div className="ticket" key={ticketType.id}>
                  <FontAwesomeIcon icon={faPaperPlane} className="icon_buy_now"/>
                  <span className='ticket__type'>{ticketType.name}</span>
                  <span className='ticket__price'>{formattedNumber} VNĐ</span>
                </div>
              )
            })}
        </div>
      </div>
      <div className="EventDetail__business_infor">
        <div className='EventDetail__business_infor--wrapper'>
            <h2 className="EventDetail__business_infor--title">Thông tin đơn vị tổ chức</h2>
            <div className="EventDetail__business_infor--detail">
              <img src='/assets/images/vuon-chau-au.jpg' alt={"bussiness image"} className="bussiness_image" />
              <span className='business_name'>NovaDreams</span>
            </div>
        </div>
      </div>
      <div className="EventDetail__relative_event">
        <div className='EventDetail__relative_event--wrapper'>
            <h2 className="EventDetail__relative_event--title">Sự kiện liên quan</h2>
            <div className="EventDetail__relative_event--container">
              {upcomingEvents.map((upcomingEvent,index)=>{
                let [year, month, day] = upcomingEvent.start_date.split('-');
                return (
                <div className="event" key={index}>
                    <img src={upcomingEvent?.src} alt="banner event" className="event__banner" />
                    <div className="event__date">
                        <span className="event__month">Tháng {month}</span>
                        <span className="event__day">{day}</span>
                        <span className="event__year">{year}</span>
                    </div>
                    <div className='event__info'>
                      <span className="event__sales">
                        <FontAwesomeIcon icon={faEye} className="event--icon" />
                        {upcomingEvent?.sales}
                      </span>
                      <span className="event__address">
                        <FontAwesomeIcon icon={faLocationDot} className="event--icon" />
                        {upcomingEvent?.location}
                      </span>
                      <span className="event__price">
                        <FontAwesomeIcon icon={faHandHoldingDollar} className="event--icon" />
                        {upcomingEvent?.price}
                      </span>
                    </div>
                    <div className="event__title">{upcomingEvent?.name}</div>
                </div>
              )})}
            </div>
            <button className="EventDetail__relative_event--more_btn">
              <FontAwesomeIcon icon={faBars} className="icon_plus"/>
              Xem thêm các sự kiện liên quan
            </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default EventDetail;