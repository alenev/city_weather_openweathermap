import React, { useEffect, useState } from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2'
import moment from 'moment';

function getFormattedDates(dateTime) {
    const momentDate = moment(dateTime);
    const formatDate = momentDate.utc().format('YYYY-MM-DD, HH:mm:ss A');
    return formatDate;
}
function getFormattedTimestamp(timestamp) {
    const formatTimestamp = moment(timestamp * 1000).utc().format('YYYY-MM-DD, HH:mm:ss A');
    return formatTimestamp;
}

export default function DbWeather({inputValue}){
    const [weatherItem, setweatherItem] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null); 
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/weather/get_by_city_name?city_name=${inputValue}`); 
            setweatherItem(response.data.data);
        } catch (error) {
            setError(error.response.data.message);
            Swal.fire({
                icon:"error",
                text:error.response.data.message
            })
        } finally {
            setIsLoading(false);
        }
    };

    if (inputValue) {
        fetchData();
    }else{
        Swal.fire({
            icon:"warning",
            text:"City name is empty"
        })
    }
    }, [inputValue]);

    return (
        <div>
        {isLoading && (
            <div className="m-2 row d-flex justify-content-center"> 
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )}
		{error && (
            <div className="m-2 row d-flex justify-content-center text-danger">Error: {error}</div>
        )}
        {weatherItem && (
            <>
            <Container className="mt-3 p-3 border border-1">
                <Row>
                    <Col md={12} className="fs-3 fw-bold">
                        {weatherItem.city_name}
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="fs-6">
                        Updated at: {getFormattedDates(weatherItem.updated_at)} UTC
                    </Col>
                </Row>                 
            </Container>

            <table className="table table-bordered mb-5 text-center">
                <thead className="text-primary fs-6">
                <tr>
                    <th className="text-primary text-start">Datetime</th>
                    <th className="text-primary text-start">Min temp</th>
                    <th className="text-primary text-start">Max temp</th>
                    <th className="text-primary text-start">Wind speed</th>
                </tr>
                </thead>
                <tbody>                 
                        <tr className="city_weather_row">
                        <td className="text-start">{getFormattedTimestamp(weatherItem.timestamp_dt)}</td>
                        <td className="text-start">{weatherItem.min_tmp} °C</td>
                        <td className="text-start">{weatherItem.max_tmp} °C</td>
                        <td className="text-start">{weatherItem.wind_spd} km/h</td>
                        </tr>
                </tbody>
            </table>
            </>
            )}
    </div>
    );
}