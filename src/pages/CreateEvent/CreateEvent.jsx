import * as React from "react";
import axios from 'axios';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { format } from 'date-fns';
import moment from 'moment';
import 'moment/locale/vi';
import "chart.js/auto";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Select from 'react-select'
import { NumericFormat } from "react-number-format";
import { TextField } from "@mui/material";
import dayjs from 'dayjs';
import 'moment/locale/vi';
import './CreateEvent.css'
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import Header from '../../components/Header';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';

function CreateEvent() {

  const [dateCurrent, setDateCurrent] = React.useState(new Date());
  const [now, setNow] = React.useState(dayjs());
  const [startTimeDayjs, setStartTimeDayjs] = React.useState(now);
  const [defaultTimeFormat, setDefaultTimeFormat] = React.useState(now.format('HH:mm:ss'));
  const [formattedDateCurrent, setFormattedDateCurrent] = React.useState(moment(dateCurrent).format("YYYY-MM-DD"));
  const [onlyFormattedDateCurrent, setOnlyFormattedDateCurrent] = React.useState(new Date(formattedDateCurrent).toISOString().split('T')[0]);

  React.useEffect(() =>{
    setStartTimeDayjs(now);
    setDefaultTimeFormat(now.format('HH:mm:ss'));
  },[now]);

  React.useEffect(() =>{
    setFormattedDateCurrent(moment(dateCurrent).format("YYYY-MM-DD"));
  },[dateCurrent]);

  React.useEffect(() =>{
    setOnlyFormattedDateCurrent(new Date(formattedDateCurrent).toISOString().split('T')[0]);
  },[formattedDateCurrent]);

  const [eventInfo, setEventInfo] = React.useState({
    "ticket_types": [],
    "event_topics": [],
    "name": "",
    "description": "",
    "start_date": onlyFormattedDateCurrent,
    "end_date": onlyFormattedDateCurrent,
    "start_time": defaultTimeFormat,
    "location": "",
    "banner_url": ""
  });
  const [bannerFile, setBannerFile] = React.useState();

  const [eventTopic, setEventTopic] = React.useState([]);

  const [ticketTypes, setTicketTypes] = React.useState([
  ]);
  const [ticket_Type, setTicket_Type] = React.useState({
    "name": "",
    "description": "",
    "price": 5000,
    "ticket_type_details": [], // Chi tiết loại vé (thêm từ API Tạo Chi Tiết Loại Vé)
    "seat_configurations": [], // Cấu hình ghế (thêm từ API Tạo Cấu Hình Ghế)
  });

  const [ticketTypeDetails, setTicketTypeDetails] = React.useState([]);
  const [ticketTypeDetail, setTicketTypeDetail] = React.useState({
    "name": "",
    "description": "",
    "fee_type": "",
    "fee_value": 0,
  });


  const [seatConfigurations, setSeatConfigurations] = React.useState([]);
  const [seatConfigurationList, setSeatConfigurationList] = React.useState([]);
  const [seatConfiguration, setSeatConfiguration] = React.useState({
    "position": "",
    "start_seat_number": 1,
    "end_seat_number": 1
  });


  const [errors, setErrors] = React.useState({});
  const [taskName, setTaskName] = React.useState("event_input");
  const [selectedIndex, setSelectedIndex] = React.useState("");


  const addTicketType = () => {
    const newErrors = {};
    setErrors([]);

    const listTicket = [...ticketTypes]

    for (var i = 0; i < listTicket.length; i++) {
      if (listTicket[i]?.name === ticket_Type.name) {
        newErrors["ticket_type_name_error"] = "Tên loại vé không được trùng";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            ticket_type_name_error: "Tên loại vé không được trùng"
          }
        });
      }
    }


    if (!ticket_Type.name) {
      newErrors["ticket_type_name_error"] = "Tên loại vé không được để trống";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          ticket_type_name_error: "Tên loại vé không được để trống"
        }
      });
    }

    if (!ticket_Type.description) {
      newErrors["ticket_type_description_error"] = "Mô tả loại vé không được để trống";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          ticket_type_description_error: "Mô tả loại vé không được để trống"
        }
      });
    }

    if (!ticket_Type.price || ticket_Type.price === 0) {
      newErrors["ticket_type_price_error"] = "Giá loại vé không hợp lệ";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          ticket_type_price_error: "Giá loại vé không hợp lệ"
        }
      });
    }

    if (Object.values(newErrors).length === 0) {
      setTicketTypes([...ticketTypes, ticket_Type]);
      setTicket_Type({
        "name": "",
        "description": "",
        "price": 5000,
        "ticket_type_details": [],
        "seat_configurations": [],
      });
    }
  };

  const handleAddService = () => {
    const newErrors = {};
    setErrors([]);

    if (!ticketTypeDetail.name) {
      newErrors["ticket_type_detail_name_error"] = "Tên dịch vụ không được để trống";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          ticket_type_detail_name_error: "Tên dịch vụ không được để trống"
        }
      });
    }

    if (!ticketTypeDetail.description) {
      newErrors["ticket_type_detail_description_error"] = "Mô tả dịch vụ không được để trống";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          ticket_type_detail_description_error: "Mô tả dịch vụ không được để trống"
        }
      });
    }

    if (!ticketTypeDetail.fee_type) {
      newErrors["ticket_type_detail_fee_type_error"] = "Loại phí dịch vụ không được để trống";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          ticket_type_detail_fee_type_error: "Loại phí dịch vụ không được để trống"
        }
      });
    }

    if (ticketTypeDetail.fee_value < 0) {
      newErrors["ticket_type_detail_fee_value_error"] = "Phí dịch vụ không hợp lệ";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          ticket_type_detail_fee_value_error: "Phí dịch vụ không hợp lệ"
        }
      });
    }

    if (Object.values(newErrors).length === 0) {
      setTicketTypeDetails([...ticketTypeDetails, ticketTypeDetail]);
      setTicketTypeDetail({
        "name": "",
        "description": "",
        "fee_type": "",
        "fee_value": 0,
      });
    }
  };

  const isWithinRange = (values) => {
    const { floatValue } = values;
    return floatValue >= 5000 && floatValue <= 1000000000;
  };

  const handleAddBanner = (event) =>{
    setErrors([]);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    axios({
      method: 'post',
      url: `${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/image`,
      data: {image: formData.get("file")},
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        if (response.data.status === 1) {
          setEventInfo((prevalue) => {
            return {
              ...prevalue,
              banner_url: response.data.data.url
            }
          })
        }
      })
  }

  const handleAddSeat = () => {
    setErrors([]);
    const newErrors = {};
    setErrors([]);

    if (!ticket_Type.name) {
      newErrors["selected_ticket_type_error"] = "Loại vé không được trống";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          selected_ticket_type_error: "Loại vé không được trống"
        }
      });

    }

    if (!seatConfiguration.position) {
      newErrors["seat_configuration_position_error"] = "Ví trị ghế không được để trống";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          seat_configuration_position_error: "Ví trị ghế không được để trống"
        }
      });
    }

    const seatConfigurationArray = [...seatConfigurationList];
    for (var i = 0; i < seatConfigurationArray.length; i++) {
      if (seatConfigurationArray[i]?.position === seatConfiguration.position) {
        if (seatConfiguration.start_seat_number === seatConfigurationArray[i]?.end_seat_number) {
          newErrors["seat_configuration_start_seat_error"] = "Ví trị ghế bắt đầu không hợp lệ";
          setErrors((prevalue) => {
            return {
              ...prevalue,
              seat_configuration_start_seat_error: "Ví trị ghế bắt đầu không hợp lệ"
            }
          });
        }

        if (seatConfiguration.start_seat_number < seatConfigurationArray[i]?.end_seat_number) {
          newErrors["seat_configuration_start_seat_error"] = "Ví trị ghế bắt đầu không hợp lệ";
          setErrors((prevalue) => {
            return {
              ...prevalue,
              seat_configuration_start_seat_error: "Ví trị ghế bắt đầu không hợp lệ"
            }
          });
        }
      }

      if (seatConfigurationArray[i]?.start_seat_number === seatConfiguration.start_seat_number) {
        newErrors["seat_configuration_start_seat_error"] = "Ví trị ghế bắt đầu không hợp lệ";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            seat_configuration_start_seat_error: "Ví trị ghế bắt đầu không hợp lệ"
          }
        });
      }

      if (seatConfiguration.start_seat_number < seatConfigurationArray[seatConfigurationArray.length - 1]?.end_seat_number) {
        newErrors["seat_configuration_start_seat_error"] = "Ví trị ghế bắt đầu không hợp lệ";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            seat_configuration_start_seat_error: "Ví trị ghế bắt đầu không hợp lệ"
          }
        });
      }
    }

    if (seatConfiguration.start_seat_number > seatConfiguration.end_seat_number) {
      newErrors["seat_configuration_end_seat_error"] = "Ví trị ghế kết thúc không nhỏ hơn ghế bắt đầu";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          seat_configuration_end_seat_error: "Ví trị ghế kết thúc không nhỏ hơn ghế bắt đầu"
        }
      });
    }

    if (Object.values(newErrors).length === 0) {
      setSeatConfigurations([...seatConfigurations, seatConfiguration]);
      setSeatConfigurationList([...seatConfigurationList, seatConfiguration]);
      setSeatConfiguration({
        "position": "",
        "start_seat_number": 1,
        "end_seat_number": 1
      });
    }
  };

  React.useEffect(() => {
    setTicket_Type((prevState) => ({
      ...prevState,
      seat_configurations: seatConfigurations,
      ticket_type_details: ticketTypeDetails
    }));
  }, [seatConfigurations, ticketTypeDetails]);

  React.useEffect(() => {
    const updatedTickets = [...ticketTypes];
    for (var i = 0; i < updatedTickets.length; i++) {
      if (i === selectedIndex) {
        updatedTickets[i] = ticket_Type;
      }
    }
    setTicketTypes(updatedTickets);
  }, [ticket_Type]);

  const handleSelected = (value, index) => {
    setTicket_Type(value);
    setSelectedIndex(index);
  }

  React.useEffect(() => {
    setSeatConfigurations(ticket_Type.seat_configurations);
    setTicketTypeDetails(ticket_Type.ticket_type_details);
  }, [selectedIndex]);

  React.useEffect(() => {
    setEventInfo((prevalue) => {
      return {
        ...prevalue,
        ticket_types: ticketTypes
      }
    });
  }, [ticketTypes]);


  const handleNextTask = () => {
    const newErrors = {};
    setErrors([]);
    if (taskName === "event_input") {
      if (!eventInfo.name) {
        newErrors["event_name_error"] = "Tên sự kiện không được để trống";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            event_name_error: "Tên sự kiện không được để trống"
          }
        });
      }

      if (!eventInfo.description) {
        newErrors["event_description_error"] = "Mô tả sự kiện không được để trống";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            event_description_error: "Mô tả sự kiện không được để trống"
          }
        });
      }

      if (eventInfo.start_date > eventInfo.end_date) {
        newErrors["event_date_error"] = "Ngày bắt đầu sự kiện không được lớn hơn ngày kết thúc";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            event_date_error: "Ngày bắt đầu sự kiện không được lớn hơn ngày kết thúc"
          }
        });
      }

      if (!eventInfo.start_time) {
        newErrors["event_time_error"] = "Thời gian bắt đầu sự kiện không được để trống";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            event_time_error: "Thời gian bắt đầu sự kiện không được để trống"
          }
        });
      }

      const currentTime = dayjs();
      const startTime = dayjs(`${eventInfo.start_date} ${eventInfo.start_time}`, 'YYYY-MM-DD HH:mm:ss');

      if (eventInfo.start_date === onlyFormattedDateCurrent && startTime.isBefore(currentTime)) {
        newErrors["event_time_error"] = "Thời gian bắt đầu sự kiện không được nhỏ hơn thời gian hiện tại";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            event_time_error: "Thời gian bắt đầu sự kiện không được nhỏ hơn thời gian hiện tại"
          }
        });
      }

      if (!eventInfo.location) {
        newErrors["event_location_error"] = "Nơi diễn ra sự kiện không được để trống";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            event_location_error: "Nơi diễn ra sự kiện không được để trống"
          }
        });
      }

      if (!eventInfo.banner_url) {
        newErrors["event_banner_error"] = "Banner sự kiện không được để trống";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            event_banner_error: "Banner sự kiện không được để trống"
          }
        });
      }

      if (Object.values(eventInfo.event_topics).length === 0) {
        newErrors["event_topics_error"] = "Chủ đề sự kiện không được để trống";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            event_topics_error: "Chủ đề sự kiện không được để trống"
          }
        });
      }

      if (Object.values(newErrors).length === 0) {
        setTaskName("ticket_type_input")
      }

    } else if (taskName === "ticket_type_input") {
      if (ticketTypes.length === 0) {
        newErrors["ticket_type_list_error"] = "Danh sách loại vé không được trống";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            ticket_type_list_error: "Danh sách loại vé không được trống"
          }
        });
      }
      if (Object.values(newErrors).length === 0) {
        setTaskName("service_input")
      }
    } else if (taskName === "service_input") {
      setTaskName("seat_class_input")
    }
  }

  const handlePrevTask = () => {
    setErrors([]);
    if (taskName === "ticket_type_input") {
      setTaskName("event_input")
    } else if (taskName === "service_input") {
      setTaskName("ticket_type_input")
    } else if (taskName === "seat_class_input") {
      setTaskName("service_input")
    }
  }

  const handleChange = (event, nameObject) => {
    setErrors([]);
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

  const handleChangeName = (event, nameObject) => {
    let value = event.target.value;

    if (nameObject === 'event input') {
      setEventInfo((prevalue) => {
        return {
          ...prevalue,
          name: value
        }
      })
    } else if (nameObject === 'ticket input') {
      setTicket_Type((prevalue) => {
        return {
          ...prevalue,
          name: value
        }
      });


    } else if (nameObject === 'service input') {
      setTicketTypeDetail((prevalue) => {
        return {
          ...prevalue,
          name: value
        }
      })
    }
  }

  const handleChangeNumber = (event, nameObject) => {
    setErrors([]);
    const stringValue = event.target.value;
    const sanitizedValue = stringValue.replace(/[^0-9.]/g, ''); // Loại bỏ tất cả ký tự không phải số hoặc dấu chấm
    const value = parseFloat(sanitizedValue);
    let name = event.target.name;

    if (nameObject === 'ticket input') {
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
    setErrors([]);
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const onlyFormattedDate = new Date(formattedDate).toISOString().split('T')[0];
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
    const formattedTime = val.format('HH:mm:ss');
    setStartTimeDayjs(val);
    setEventInfo((prevValue) => ({
      ...prevValue,
      start_time: formattedTime,
    }));
  }

  const [eventSended, setEventSended] = React.useState(false);

  const handleSubmit = () => {
    const newErrors = {};
    setErrors([]);

    const updatedTickets = [...ticketTypes];
    for (var i = 0; i < updatedTickets.length; i++) {
      if (updatedTickets[i].seat_configurations.length === 0) {
        newErrors["seat_list_error"] = "Danh sách ghế cho từng loại vé không được trống";
        setErrors((prevalue) => {
          return {
            ...prevalue,
            seat_list_error: "Danh sách ghế cho từng loại vé không được trống"
          }
        });
      }
    }

    if (Object.keys(newErrors).length === 0) {
      axios.post(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/event`, {
        ticket_types: eventInfo.ticket_types,
        event_topics: eventInfo.event_topics,
        name: eventInfo.name,
        description: eventInfo.description,
        start_date: eventInfo.start_date,
        end_date: eventInfo.end_date,
        start_time: (eventInfo.start_time).format('HH:mm:ss'),
        location: eventInfo.location,
        banner_url: eventInfo.banner_url,
      })
        .then(function (response) {
          console.log(response);
          if (response.data.status === 1) {
            setEventSended(true);
            setTimeout(() => {
              setEventSended(false);
            }, 1500);
            setTimeout(() => {
              setTaskName('event_input');
              setNow(dayjs());
              setDateCurrent(new Date());
              setEventInfo({
                "ticket_types": [],
                "event_topics": [],
                "name": "",
                "description": "",
                "start_date": onlyFormattedDateCurrent,
                "end_date": onlyFormattedDateCurrent,
                "start_time": defaultTimeFormat,
                "location": "",
                "banner_url": ""
              });
              setTicketTypes([]);
              setTicketTypeDetails([]);
              setSeatConfigurations([]);
              setBannerFile();
              setTicket_Type({
                  "name": "",
                  "description": "",
                  "price": 5000,
                  "ticket_type_details": [],
                  "seat_configurations": [],
                });
              setTicketTypeDetail({
                  "name": "",
                  "description": "",
                  "fee_type": "",
                  "fee_value": 0,
                });
              setSeatConfigurationList([]);
              setSeatConfiguration({
                  "position": "",
                  "start_seat_number": 1,
                  "end_seat_number": 1
                });
            }, 2000);
          } else {
            setErrors((prevalue) => {
              return {
                ...prevalue,
                create_event_error: response.data.message
              }
            });
          }
        })
        .catch(function (error) {
          setErrors((prevalue) => {
            return {
              ...prevalue,
              error_submit: error.message
            }
          });
        });
    }
  }

  React.useEffect(() => {
    setEventInfo(prevState => ({
      ...prevState,
      start_time: dayjs()// Tính toán giá trị start_time ở đây
    }));

    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/event-topic`, {
    })
      .then(function (response) {
        if (response.data.status === 1) {
          setEventTopic(response.data.data);
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

  const eventTopicsOption = eventTopic.map(topic => ({
    value: topic?.id,
    label: topic?.name
  }));

  const handleTopicChange = (selectedOptions) => {
    setEventInfo(prevEventInfo => ({
      ...prevEventInfo,
      event_topics: selectedOptions.map(option => option.value)
    }));
  };

  const deleteTicketType = (index) =>{
    const updatedTickets = [...ticketTypes];
    for (var i = 0; i < updatedTickets.length; i++) {
      if (i === index) {
        updatedTickets.splice(i, 1);
      }
    }
    setTicketTypes(updatedTickets);
  }

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
                value={eventInfo.name}
                onChange={(event) => handleChangeName(event, 'event input')}
                placeholder='Nhập tên sự kiện'
                className={errors.event_name_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              {errors["event_name_error"] && <span className="error">{errors["event_name_error"]}</span>}
              <label htmlFor="description" className='Create_event_form__label'>Mô tả</label>
              <textarea
                type="text"
                id="description"
                name="description"
                value={eventInfo.description}
                onChange={(event) => handleChange(event, 'event input')}
                placeholder='Nhập mô tả sự kiện'
                className={errors.event_description_error ? "Create_event_form__input_description error-input" : "Create_event_form__input_descriptio normal-input"}
                rows={4}
                cols={40}
              />
              {errors["event_description_error"] && <span className="error">{errors["event_description_error"]}</span>}
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
                className={errors.event_date_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              {errors["event_date_error"] && <span className="error">{errors["event_date_error"]}</span>}
              <label htmlFor="start_time" className='Create_event_form__label'>Giờ khai mạc</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker']}>
                  <TimePicker
                    id="start_time"
                    name="start_time"
                    views={['hours', 'minutes', 'seconds']}
                    value={startTimeDayjs}
                    onChange={onTimeChangeHandler}
                    className={errors.event_time_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                  />
                </DemoContainer>
              </LocalizationProvider>
              {errors["event_time_error"] && <span className="error">{errors["event_time_error"]}</span>}
              <label htmlFor="location" className='Create_event_form__label'>Địa điểm</label>
              <input
                type="text"
                id="location"
                name="location"
                value={eventInfo.location}
                onChange={(event) => handleChange(event, 'event input')}
                placeholder='Nhập địa điểm tổ chức'
                className={errors.event_location_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              {errors["event_location_error"] && <span className="error">{errors["event_location_error"]}</span>}
              <label htmlFor="bannerFile" className='Create_event_form__label'>Banner</label>
              <input
                type="file"
                id="bannerFile"
                name="image"
                accept="image/*"
                onChange={(event) => handleAddBanner(event)}
                placeholder='Chọn banner'
                className={errors.event_banner_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              {errors["event_banner_error"] && <span className="error">{errors["event_banner_error"]}</span>}
              <label htmlFor="event_topics" className='Create_event_form__label'>Chủ đề sự kiện</label>
              <Select
                id="event_topics"
                name="event_topics"
                isMulti
                className={errors.event_topics_error ? "Create_event_form__select error-input" : "Create_event_form__select normal-input"}
                onChange={handleTopicChange}
                placeholder='Chọn chủ đề sự kiện'
                options={eventTopicsOption}
              />
              {errors["event_topics_error"] && <span className="error">{errors["event_topics_error"]}</span>}
              <button type="button" className='Create_event__form--submit_btn' onClick={handleNextTask}>Tiếp theo</button>
            </div>}
          {taskName === 'ticket_type_input' &&
            <div className="Create_event__ticket_type_input">
              <h2 className="Create_event__ticket_type_input--title">Thêm các loại vé</h2>
              <label htmlFor="ticket_type_name" className='Create_event_form__label'>Tên loại vé</label>
              <input
                type="text"
                id="ticket_type_name"
                value={ticket_Type.name}
                onChange={(event) => handleChangeName(event, 'ticket input')}
                placeholder='Nhập tên loại vé'
                className={errors.ticket_type_name_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              {errors["ticket_type_name_error"] && <span className="error">{errors["ticket_type_name_error"]}</span>}
              <label htmlFor="ticket_description" className='Create_event_form__label'>Mô tả</label>
              <textarea
                type="text"
                id="ticket_description"
                name="description"
                value={ticket_Type.description}
                onChange={(event) => handleChange(event, 'ticket input')}
                placeholder='Nhập mô tả loại vé'
                className={errors.ticket_type_description_error ? "Create_event_form__input_description error-input" : "Create_event_form__input_description normal-input"}
                rows={4}
                cols={40}
              />
              {errors["ticket_type_description_error"] && <span className="error">{errors["ticket_type_description_error"]}</span>}
              <label htmlFor="ticket_price" className='Create_event_form__label'>Giá vé</label>
              <NumericFormat
                id="ticket_price"
                name="price"
                value={ticket_Type.price}
                thousandSeparator={true}
                customInput={TextField}
                isAllowed={isWithinRange}
                onChange={(event) => handleChangeNumber(event, 'ticket input')}
                placeholder='Nhập giá vé'
                className={errors.ticket_type_price_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
              />
              {errors["ticket_type_price_error"] && <span className="error">{errors["ticket_type_price_error"]}</span>}
              <button type="button" className='Create_event__form--submit_btn' onClick={addTicketType}>Thêm</button>
              <h3 className="List_ticket_type__title">Danh sách các loại vé</h3>
              <div className="form__list">
              <Table striped bordered hover className='custome_table'>
                <thead>
                  <tr className='table__title'>
                    <th className="name_ticket">Tên</th>
                    <th className='price_ticket'>Giá</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                    {ticketTypes !== null && ticketTypes.map((ticket, index) => {
                      return (
                      <tr key={index}  className={`list_ticket`}>
                        <td className="stt">{ticket?.name}</td>
                        <td className='name_ticket'>{ticket?.price.toLocaleString('en-US')} VND</td>
                        <td className='price_ticket'>
                          <button type="button" className='btn btn-danger remove_ticket_btn' onClick={() => deleteTicketType(index)}>Xóa</button>
                        </td>
                      </tr>
                    )})}
                </tbody>
              </Table>
              </div>
              {errors["ticket_type_list_error"] && <span className="error">{errors["ticket_type_list_error"]}</span>}
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
                          <tr key={index} onClick={() => handleSelected(ticket, index)}>
                            <td className="stt">{index}</td>
                            <td>{ticket?.name}</td>
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
                      value={ticket_Type?.name}
                      readOnly
                      disabled
                      className={errors.email ? "Create_event_form__input error-input disable" : "Create_event_form__input normal-input disable"}
                    />
                    <label htmlFor="service_name" className='Create_event_form__label'>Tên dịch vụ</label>
                    <input
                      type="text"
                      id="service_name"
                      value={ticketTypeDetail.name}
                      onChange={(event) => handleChangeName(event, 'service input')}
                      placeholder='Nhập tên dịch vụ'
                      className={errors.ticket_type_detail_name_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                    />
                    {errors["ticket_type_detail_name_error"] && <span className="error">{errors["ticket_type_detail_name_error"]}</span>}
                    <label htmlFor="description" className='Create_event_form__label'>Mô tả</label>
                    <textarea
                      type="text"
                      id="description"
                      name="description"
                      value={ticketTypeDetail.description}
                      onChange={(event) => handleChange(event, 'service input')}
                      placeholder='Nhập mô tả sự kiện'
                      className={errors.ticket_type_detail_description_error ? "Create_event_form__input_description error-input" : "Create_event_form__input_descriptio normal-input"}
                      rows={4}
                      cols={40}
                    />
                    {errors["ticket_type_detail_description_error"] && <span className="error">{errors["ticket_type_detail_description_error"]}</span>}
                    <label htmlFor="fee_type" className='Create_event_form__label'>Loại giá dịch vụ</label>
                    <select
                      id="fee_type"
                      name="fee_type"
                      className={errors.ticket_type_detail_fee_type_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                      value={ticketTypeDetail.fee_type}
                      placeholder='Chọn loại giá dịch vụ'
                      onChange={(event) => handleChange(event, 'service input')}
                    >
                      <option value="persent">Tính theo phần trăm</option>
                      <option value="cash">Tính theo giá trị cố định</option>
                    </select>
                    {errors["ticket_type_detail_fee_type_error"] && <span className="error">{errors["ticket_type_detail_fee_type_error"]}</span>}
                    <label htmlFor="fee_value" className='Create_event_form__label'>Giá dịch vụ</label>
                    <NumericFormat
                      id="fee_value"
                      name="fee_value"
                      value={ticketTypeDetail.fee_value}
                      thousandSeparator={true}
                      customInput={TextField}
                      onChange={(event) => handleChangeNumber(event, 'service input')}
                      placeholder='Nhập giá vé'
                      className={errors.ticket_type_detail_fee_value_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                    />
                    {errors["ticket_type_detail_fee_value_error"] && <span className="error">{errors["ticket_type_detail_fee_value_error"]}</span>}
                    <button type="button" className='Create_event__form--submit_btn' onClick={handleAddService}>Thêm</button>
                    <h3 className="form__list--title">Danh sách các dịch vụ</h3>
                    <div className="form__list">
                      {ticketTypeDetails !== null && ticketTypeDetails.map((ticket, index) => {
                        return (<span key={index}> {ticket?.name}</span>);
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
                          <tr key={index} onClick={() => handleSelected(ticket, index)}>
                            <td className="stt">{index}</td>
                            <td>{ticket?.name}</td>
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
                      value={ticket_Type?.name}
                      readOnly
                      disabled
                      className={errors.selected_ticket_type_error ? "Create_event_form__input error-input disable" : "Create_event_form__input normal-input disable"}
                    />
                    {errors["selected_ticket_type_error"] && <span className="error">{errors["selected_ticket_type_error"]}</span>}
                    <label htmlFor="position" className='Create_event_form__label'>Hàng ghế</label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={seatConfiguration.position}
                      onChange={(event) => handleChange(event, 'seat input')}
                      placeholder='Nhập hàng ghế'
                      className={errors.seat_configuration_position_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                    />
                    {errors["seat_configuration_position_error"] && <span className="error">{errors["seat_configuration_position_error"]}</span>}
                    <div className="form__seat_range">
                      <div className="form__start_seat">
                        <label htmlFor="start_seat_number" className='sign_up_form__label'>Số ghế bắt đầu</label>
                        <NumericFormat
                          id="start_seat_number"
                          name="start_seat_number"
                          value={seatConfiguration.start_seat_number}
                          thousandSeparator={true}
                          customInput={TextField}
                          onChange={(event) => handleChangeNumber(event, 'seat input')}
                          placeholder='Ghế bắt đầu'
                          className={errors.seat_configuration_start_seat_error ? "form_input_seat error-input" : "form_input_seat normal-input"}
                        />
                        {/* <input
                          type="text"
                          id="start_seat_number"
                          name="start_seat_number"
                          placeholder='Ghế bắt đầu'
                          value={seatConfiguration.start_seat_number}
                          className={errors.seat_configuration_start_seat_error ? "form_input_seat error-input" : "form_input_seat normal-input"}
                          onChange={(event) => handleChange(event, 'seat input')}
                        /> */}
                        {errors["seat_configuration_start_seat_error"] && <span className="error">{errors["seat_configuration_start_seat_error"]}</span>}
                      </div>
                      <div className="form_last_seat">
                        <label htmlFor="end_seat_number" className='sign_up_form__label'>Số ghế kết thúc</label>
                        <NumericFormat
                          id="end_seat_number"
                          name="end_seat_number"
                          value={seatConfiguration.end_seat_number}
                          thousandSeparator={true}
                          customInput={TextField}
                          onChange={(event) => handleChangeNumber(event, 'seat input')}
                          placeholder='Ghế bắt đầu'
                          className={errors.seat_configuration_end_seat_error ? "form_input_seat error-input" : "form_input_seat normal-input"}
                        />
                        {errors["seat_configuration_end_seat_error"] && <span className="error">{errors["seat_configuration_end_seat_error"]}</span>}
                      </div>
                    </div>
                    <button type="button" className='Create_event__form--submit_btn' onClick={handleAddSeat}>Thêm</button>
                    <h3 className="form__list--title">Danh sách các hàng ghế</h3>
                    <div className={errors.seat_list_error ? "form__list_full error-input" : "form__list_full"}>
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
                                <tr key={index}>
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
                    {errors["seat_list_error"] && <span className="error">{errors["seat_list_error"]}</span>}
                  </div>
                }
              </div>
              {!eventSended && <span className="successful">
                Thêm sự kiện thành công!
              </span>}
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