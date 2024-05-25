import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useRef } from 'react'

const ShowEventSM = (event) => {

    let [year, month, day] = "";
    if (event.date) {
        [year, month, day] = event.date.split('-');
    }

    return (
        <div className="event">
            <div className="event__info">
                <img src={event?.src} alt="banner event" className="" />
                <div className="event__date">
                    <span className="event__month">Tháng {month}</span>
                    <span className="event__day">{day}</span>
                    <span className="event__year">{year}</span>
                </div>
                <div className="event__address">
                    <span className="event__place">
                        <FontAwesomeIcon icon={faLocationDot} className="Header__search--icon" />
                        {event?.loction}
                    </span>
                </div>
            </div>
            <div className="event__title">{event?.title}</div>

        </div>
    );

}

export default ShowEventSM;