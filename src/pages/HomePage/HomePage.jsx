import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCalendarDays, faClock, faEye, faHandHoldingDollar, faLocationDot, faPlus } from '@fortawesome/free-solid-svg-icons';
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
import "chart.js/auto";

// import style css
import './HomePage.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// import component
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import Header from '../../components/Header';
import NavTopCus from '../../components/NavTopCus';
import axios from 'axios';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

SwiperCore.use([EffectCards]);

function HomePage() {
  const [errors, setErrors] = React.useState({});
  const [banners, setBanners] = React.useState([])
  const [outstandingEvents, setOutstandingEvents] = React.useState([]);
  const [upcomingEvents, setUpcomingEvents] = React.useState([]);
  const [topicTypes, setTopicTypes] =React.useState([]);

  React.useEffect(() => {
    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/client-page/home`, {
    })
    .then(function (response) {
      if (response.data.status === 1) {
        setBanners(response.data.data.banners)
        setOutstandingEvents(response.data.data.outstanding_events)
        setUpcomingEvents(response.data.data.upcoming_events)
        setTopicTypes(response.data.data.topic_types)
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

  return (
    <div className="Homepage__wrapper">
      <Header/>
      <NavTopCus/>
      <div className="Homepage__slide">
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
          {banners.map((banner, index) => {
            let [year, month, day] = banner.start_date.split('-');
            return (
              <SwiperSlide key={index}>
                <img src={banner?.banner_url} alt={`comic img ${index + 1}`} className="banner__img" />
                <div className="Slide__info">
                  <div className='Slide__info--top'>
                    <h2 className="Slide__title">{banner?.name}</h2>
                    <div className="Slide__location">
                        <div className="Slide__date">
                          <span className="Slide__month">Tháng {month}</span>
                          <span className="Slide__day">{day}</span>
                          <span className="Slide__year">{year}</span>
                        </div>
                        <div className="Slide__address">
                          <span className="Slide__time">
                            <FontAwesomeIcon icon={faClock} className="Header__search--icon"/>
                            {banner?.start_time}
                          </span>
                          <span className="Slide__place">
                            <FontAwesomeIcon icon={faLocationDot} className="Header__search--icon"/>
                            {banner?.location}
                          </span>
                        </div>
                    </div>
                  </div>
                  <Link to={`/event-detail/${banner.id}`} className='more_btn'>Xem thêm</Link>
                </div>
              </SwiperSlide>
          )})}
        </Swiper>
      </div>
      <div className="Homepage__outstanding_events">
        <div className="Homepage__outstanding_events--top">
          <h2 className="Homepage__outstanding_events--title">Sự kiện nổi bật</h2>
          {/* <div className='Homepage__outstanding_events--btn'>
            <button className="Homepage__outstanding_events--calendar">
              <FontAwesomeIcon icon={faCalendarDays} className="icon_calendar"/>
              Lịch sự kiện
            </button>
            <button className="Homepage__outstanding_events--send">
              <FontAwesomeIcon icon={faPlus} className="icon_plus"/>
              Gửi sự kiện
            </button>
          </div> */}
        </div>
        <div className="Homepage__outstanding_events--container">
          {outstandingEvents.map((outstandingEvent,index)=>(          
            <Link to={`/event-detail/${outstandingEvent.id}`} key={index}  
              className={index < 2 ? 'poster__top' : 'poster__bottom'} >
              <img 
                src={outstandingEvent.banner_url} 
                alt={`poster + ${index + 1}`} 
                // className={index < 2 ? 'poster__top' : 'poster__bottom'} 
                // onClick={handleNavigateEventDetail(outstandingEvents?.id)}
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="Homepage__comming_soon_events">
        <h2 className="Homepage__comming_soon_events--title">Sự kiện sắp diễn ra</h2>
        <div className="Homepage__comming_soon_events--container">
          {upcomingEvents.map((upcomingEvent)=>{
            let [year, month, day] = upcomingEvent.start_date.split('-');
            return (
              <Link to={`/event-detail/${upcomingEvent.id}`} key={upcomingEvent?.id} className="event">
                <img src={upcomingEvent?.banner_url} alt="banner event" className="event__banner" />
                <div className="event__date">
                    <span className="event__month">Tháng {month}</span>
                    <span className="event__day">{day}</span>
                    <span className="event__year">{year}</span>
                </div>
                <div className='event__info'>
                  {upcomingEvent.sales && 
                    <span className="event__sales">
                      <FontAwesomeIcon icon={faEye} className="event--icon" />
                      {upcomingEvent?.sales}
                    </span>
                  }
                  <span className="event__address">
                    <FontAwesomeIcon icon={faLocationDot} className="event--icon" />
                    {upcomingEvent?.location}
                  </span>
                  {/* <span className="event__price">
                    <FontAwesomeIcon icon={faHandHoldingDollar} className="event--icon" />
                    {upcomingEvent?.price}
                  </span> */}
                </div>
                <div className="event__title">{upcomingEvent?.name}</div>
              </Link>
          )})}
        </div>
        <button className="Homepage__comming_soon_events--more_btn">
          <FontAwesomeIcon icon={faBars} className="icon_plus"/>
          Xem thêm các sự kiện sắp diễn ra
        </button>
      </div>
      <div className="Homepage__event_topics">
        <h2 className="Homepage__event_topics--title">Thể loại sự kiện</h2>
        <div className="Homepage__event_topics--container">
          {topicTypes.map((eventTopic,index)=>{
            const class_name = (index === 1 || index === 5) ? 'event_topic_big' : 'event_topic_small';
            return (
              <Link to={`/events-for-topic/${eventTopic.id}?event_topic=${eventTopic?.name}`} className={class_name}>
                <img src={eventTopic?.symbolic_image_url} alt="banner eventTopic" className="event_topic__banner" />
                <div className="event_topic__title">{eventTopic?.name}</div>
            </Link>
          )})}
        </div>
        <Link to='/all-event-topic' className="Homepage__comming_soon_events--more_btn">
          <FontAwesomeIcon icon={faBars} className="icon_plus"/>
          Xem thêm các thể loại sự kiện
        </Link>
      </div>
      <Footer/>
    </div>
  );
}

export default HomePage;