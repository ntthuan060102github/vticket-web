import * as React from 'react';
import "chart.js/auto";

// import style css
import './AllEventTopic.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// import component
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import Header from '../../components/Header';
import axios from 'axios';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function AllEventTopic() {
  const [eventTopics, setEventTopics] =React.useState([]);

  React.useEffect(() => {
    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/event-topic`, {
    })
    .then(function (response) {
      if (response.data.status === 1) {
        setEventTopics(response.data.data);
      }
    })
  }, []);

  return (
    <div className="AllEventTopic__wrapper">
      <Header/>
      <div className="AllEventTopic__event_topics">
        <h2 className="AllEventTopic__event_topics--title">Danh sách thể loại sự kiện</h2>
        <div className="AllEventTopic__event_topics--container">
          {eventTopics && eventTopics.map((eventTopic,index)=>{
            const class_name = (index%2 !== 0 && index%3 !== 0) ? 'event_topic__big' : 'event_topic__small';
            return (
              <Link 
              key={eventTopic.id}
              to={`/events-for-topic/${eventTopic.id}`} 
              state= {{ eventTopic: eventTopic?.name }}
              className={class_name}
              >
                <img src={eventTopic?.symbolic_image_url} alt="banner eventTopic" className="event_topic__banner" />
                <div className="event_topic__title">{eventTopic?.name}</div>
            </Link>
          )})}
        </div>
        {/* <button className="AllEventTopic__comming_soon_events--more_btn">
          <FontAwesomeIcon icon={faBars} className="icon_plus"/>
          Xem thêm các thể loại sự kiện
        </button> */}
      </div>
      <Footer/>
    </div>
  );
}

export default AllEventTopic;