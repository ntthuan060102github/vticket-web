import * as React from "react";
import axios from 'axios';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { format } from 'date-fns';
import moment from 'moment';
import 'moment/locale/vi';
import "chart.js/auto";
import Select from 'react-select';
import dayjs from 'dayjs';
import { TextField } from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';


import Header from "../../components/Header";
import "./CreateDiscount.css";
import { useLocation } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import VTICKET_API_SERVICE_INFOS from "../../configs/api_infos";
import { APP_ENV } from "../../configs/app_config";

function CreateDiscount() {
    const location = useLocation();
    const { eventID } = location.state || "";
    console.log(eventID);

    const [dateCurrent, setDateCurrent] = React.useState(new Date());
    const [formattedDateCurrent, setFormattedDateCurrent] = React.useState(moment(dateCurrent).format("YYYY-MM-DD"));
    const [onlyFormattedDateCurrent, setOnlyFormattedDateCurrent] = React.useState(new Date(formattedDateCurrent).toISOString().split('T')[0]);

    React.useEffect(() => {
        setFormattedDateCurrent(moment(dateCurrent).format("YYYY-MM-DD"));
    }, [dateCurrent]);

    React.useEffect(() => {
        setOnlyFormattedDateCurrent(new Date(formattedDateCurrent).toISOString().split('T')[0]);
    }, [formattedDateCurrent]);

    const [errors, setErrors] = React.useState({});
    const [discountInfo, setDiscountInfo] = React.useState({
        "discount_type": "percent",
        "discount_value": 1,
        "maximum_reduction_amount": 1,
        "quantity": 1,
        "evaluation_field": "total_bill",
        "condition": "gt",
        "evaluation_value": 1,
        "start_date": onlyFormattedDateCurrent,
        "end_date": onlyFormattedDateCurrent,
        "event": eventID,
    });

    const discountTypesOption = [
        { value: "percent", label: "Phần trăm" },
        { value: "cash", label: "Tiền mặt" },
    ];

    const evaluationFieldsOption = [
        { value: "total_bill", label: "Tổng hóa đơn" },
    ];

    const conditionsOption = [
        { value: "gt", label: "Lớn hơn" },
        { value: "gte", label: "Lớn hơn hoặc bằng" },
        { value: "lt", label: "Bé hơn" },
        { value: "lte", label: "Bé hơn hoặc bằng" },
    ];

    const handleTypeChange = (selectedOptions) => {
        setErrors([]);
        setDiscountInfo(prevDiscountInfo => ({
            ...prevDiscountInfo,
            discount_type: selectedOptions.map(option => option.value)
        }));
    };

    const handleEvaluationFieldChange = (selectedOptions) => {
        setErrors([]);
        setDiscountInfo(prevDiscountInfo => ({
            ...prevDiscountInfo,
            evaluation_field: selectedOptions.map(option => option.value)
        }));
    };

    const handleConditionChange = (selectedOptions) => {
        setErrors([]);
        setDiscountInfo(prevDiscountInfo => ({
            ...prevDiscountInfo,
            condition: selectedOptions.map(option => option.value)
        }));
    };


    const handleChange = (discount) => {
        setErrors([]);
        let value = discount.target.value;
        let name = discount.target.name;

        console.log(name, " : ", value);

        setDiscountInfo((prevalue) => {
            return {
                ...prevalue,
                [name]: value
            }
        })
    };

    const isWithinRange = (values) => {
        const { floatValue } = values;
        return floatValue >= 1 && floatValue <= 2147483647;
    };

    const handleChangeNumber = (discount, nameObject) => {
        setErrors([]);
        const stringValue = discount.target.value;
        const sanitizedValue = stringValue.replace(/[^0-9.]/g, ''); // Loại bỏ tất cả ký tự không phải số hoặc dấu chấm
        const value = parseFloat(sanitizedValue);
        let name = discount.target.name;

        setDiscountInfo((prevalue) => {
            return {
                ...prevalue,
                [name]: value
            }
        });
    }

    const handleDateChange = (date, name) => {
        setErrors([]);
        const formattedDate = moment(date).format("YYYY-MM-DD");
        const onlyFormattedDate = new Date(formattedDate).toISOString().split('T')[0];
        setDiscountInfo((prevValue) => ({
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

    const [discountPosted, setDiscountPosted] = React.useState(false);

    const handleSubmit = () => {
        const newErrors = {};
        setErrors([]);

        if (discountInfo.discount_type === "") {
            newErrors["discount_type_error"] = "Loại khuyến mãi không được trống";
        }

        if (discountInfo.evaluation_field === "") {
            newErrors["evaluation_field_error"] = "Loại đánh giá không được trống";
        }

        if (discountInfo.condition === "") {
            newErrors["condition_error"] = "Điều kiện không được trống";
        }
    
        if (Object.keys(newErrors).length !== 0) {
            setErrors(newErrors);
        } else {

        console.log(discountInfo);
          axios.post(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/promotion`, {
            discount_type: discountInfo.discount_type,
            discount_value: discountInfo.discount_value,
            maximum_reduction_amount: discountInfo.maximum_reduction_amount,
            quantity: discountInfo.quantity,
            evaluation_field: discountInfo.evaluation_field,
            condition: discountInfo.condition,
            evaluation_value: discountInfo.evaluation_value,
            start_date: discountInfo.start_date,
            end_date: discountInfo.end_date,
            event: discountInfo.event,
          })
          .then(function (response) {
            console.log(response);
            if (response.data.status === 1) {
              setDiscountPosted(true);
              setTimeout(() => {
                setDiscountPosted(false);
              }, 1500);
              setTimeout(() => {
                setDateCurrent(new Date());
                setDiscountInfo({
                    "discount_type": "",
                    "discount_value": 1,
                    "maximum_reduction_amount": 1,
                    "quantity": 1,
                    "evaluation_field": "",
                    "condition": "",
                    "evaluation_value": 1,
                    "start_date": onlyFormattedDateCurrent,
                    "end_date": onlyFormattedDateCurrent,
                    "discount": eventID,
                });
                }, 2000);
                }
            })
        }
    }

    return (
        <div className="Create_discount__wrapper">
            <Header />
            <div className="Create_discount">
                <div className="Create_discount__infor_discount_input">
                    <h2 className="Create_discount__infor_discount_input--title">Nhập thông tin khuyến mãi</h2>
                    <label htmlFor="discount_type" className='Create_discount_form__label'>Loại khuyến mãi</label>
                    <select
                      id="discount_type"
                      name="discount_type"
                      className={errors.discount_type_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                      value={discountInfo.discount_type}
                      placeholder='Chọn loại khuyến mãi'
                      onChange={(event) => handleChange(event)}
                    >
                        {discountTypesOption.map((discountType, index)=>(
                            <option key={index} value={discountType.value}>{discountType.label}</option>
                        ))}
                    </select>
                    {errors["discount_type_error"] && <span className="error">{errors["discount_type_error"]}</span>}
                    <label htmlFor="discount_value" className='Create_discount_form__label'>Giá trị giảm</label>
                    <NumericFormat
                        id="discount_value"
                        name="discount_value"
                        value={discountInfo.discount_value}
                        thousandSeparator={true}
                        customInput={TextField}
                        isAllowed={isWithinRange}
                        onChange={(e) => handleChangeNumber(e)}
                        placeholder='Nhập giá trị giảm'
                        className={errors.discount_value_error ? "Create_discount_form__input error-input" : "Create_discount_form__input normal-input"}
                    />
                    {errors["discount_value_error"] && <span className="error">{errors["discount_value_error"]}</span>}
                    <label htmlFor="maximum_reduction_amount" className='Create_discount_form__label'>Số tiền giảm tối đa</label>
                    <NumericFormat
                        id="maximum_reduction_amount"
                        name="maximum_reduction_amount"
                        value={discountInfo.maximum_reduction_amount}
                        thousandSeparator={true}
                        customInput={TextField}
                        isAllowed={isWithinRange}
                        onChange={(e) => handleChangeNumber(e)}
                        placeholder='Nhập số tiền giảm tối đa'
                        className={errors.maximum_reduction_amount_error ? "Create_discount_form__input error-input" : "Create_discount_form__input normal-input"}
                    />
                    {errors["maximum_reduction_amount_error"] && <span className="error">{errors["maximum_reduction_amount_error"]}</span>}
                    <label htmlFor="quantity" className='Create_discount_form__label'>Số lượng</label>
                    <NumericFormat
                        id="quantity"
                        name="quantity"
                        value={discountInfo.quantity}
                        thousandSeparator={true}
                        customInput={TextField}
                        isAllowed={isWithinRange}
                        onChange={(e) => handleChangeNumber(e)}
                        placeholder='Nhập số lượng'
                        className={errors.quantity_error ? "Create_discount_form__input error-input" : "Create_discount_form__input normal-input"}
                    />
                    {errors["quantity_error"] && <span className="error">{errors["quantity_error"]}</span>}
                    <label htmlFor="evaluation_field" className='Create_discount_form__label'>Lĩnh vực đánh giá</label>
                    <select
                      id="evaluation_field"
                      name="evaluation_field"
                      className={errors.evaluation_field_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                      value={discountInfo.evaluation_field}
                      placeholder='Chọn loại khuyến mãi'
                      onChange={(event) => handleChange(event)}
                    >
                        {evaluationFieldsOption.map((evaluationField, index)=>(
                            <option key={index} value={evaluationField.value}>{evaluationField.label}</option>
                        ))}
                    </select>
                    {errors["evaluation_field_error"] && <span className="error">{errors["evaluation_field_error"]}</span>}
                    <label htmlFor="condition" className='Create_discount_form__label'>Điều kiện</label>
                    <select
                      id="condition"
                      name="condition"
                      className={errors.condition_error ? "Create_event_form__input error-input" : "Create_event_form__input normal-input"}
                      value={discountInfo.condition}
                      placeholder='Chọn loại khuyến mãi'
                      onChange={(event) => handleChange(event)}
                    >
                        {conditionsOption.map((condition, index)=>(
                            <option key={index} value={condition.value}>{condition.label}</option>
                        ))}
                    </select>
                    {errors["condition_error"] && <span className="error">{errors["condition_error"]}</span>}
                    <label htmlFor="evaluation_value" className='Create_discount_form__label'>Giá trị đánh giá</label>
                    <NumericFormat
                        id="evaluation_value"
                        name="evaluation_value"
                        value={discountInfo.evaluation_value}
                        thousandSeparator={true}
                        customInput={TextField}
                        isAllowed={isWithinRange}
                        onChange={(e) => handleChangeNumber(e)}
                        placeholder='Nhập giá vé'
                        className={errors.evaluation_value_error ? "Create_discount_form__input error-input" : "Create_discount_form__input normal-input"}
                    />
                    {errors["evaluation_value_error"] && <span className="error">{errors["evaluation_value_error"]}</span>}
                    <label htmlFor="start_date" className='Create_discount_form__label'>Ngày bắt đầu</label>
                    <Datetime
                        id="start_date"
                        name="start_date"
                        value={format(discountInfo.start_date, "dd-MM-yyyy")}
                        onChange={(date) => handleDateChange(date, 'start_date')}
                        dateFormat="DD-MM-YYYY"
                        timeFormat={false}
                        locale="vi"
                        closeOnSelect={true}
                        renderMonth={(props, month) => <td {...props}>Thg {month + 1}</td>}
                        placeholderText="Chọn ngày bắt đầu"
                        isValidDate={isValidDate}
                        className={errors.birthday ? "Create_discount_form__input error-input" : "Create_discount_form__input normal-input"}
                    />
                    <label htmlFor="end_date" className='Create_discount_form__label'>Ngày kết thúc</label>
                    <Datetime
                        id="end_date"
                        name="end_date"
                        value={format(discountInfo.end_date, "dd-MM-yyyy")}
                        onChange={(date) => handleDateChange(date, 'end_date')}
                        dateFormat="DD-MM-YYYY"
                        timeFormat={false}
                        locale="vi"
                        closeOnSelect={true}
                        renderMonth={(props, month) => <td {...props}>Thg {month + 1}</td>}
                        placeholderText="Chọn ngày kết thúc"
                        isValidDate={isValidDate}
                        className={errors.discount_date_error ? "Create_discount_form__input error-input" : "Create_discount_form__input normal-input"}
                    />
                    {errors["discount_date_error"] && <span className="error">{errors["discount_date_error"]}</span>}
                    {discountPosted && <span className="successful">
                        Thêm mã khuyến mãi thành công!
                    </span>}
                    <button type="button" className='Create_discount__form--submit_btn' onClick={() => handleSubmit()}>Tạo mã giảm giá</button>
                </div>
            </div>
        </div>
    );
}

export default CreateDiscount;