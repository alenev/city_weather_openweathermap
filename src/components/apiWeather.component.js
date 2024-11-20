import React, { useEffect, useState } from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2'
import moment from 'moment';


function getFormattedTimestamp(timestamp) {
    const formatTimestamp = moment(timestamp * 1000).utc().format('YYYY-MM-DD, HH:mm:ss A');
    return formatTimestamp;
}

export default function ApiWeather({inputValue}){
    const [weatherItems, setweatherItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null); 
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/weather/get_open_weather_map_city_data?city_name=${inputValue}`); 
            setweatherItems(response.data.data);
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

    const saveForecast = async () => {
        setIsLoading(true);
        setError(null); 
        const data = {
            "timestamp_dt": weatherItems[0].timestamp_dt, 
            "city_name": weatherItems[0].city_name, 
            "min_tmp": weatherItems[0].max_tmp, 
            "max_tmp": weatherItems[0].min_tmp, 
            "wind_spd": weatherItems[0].wind_spd
        }
        try {
            const url = 'http://127.0.0.1:8000/api/weather/store_open_weather_map_city_data';
            const response =  await axios.post(url, data)
            Swal.fire({
                icon:"warning",
                text:response.data.message
            })
        } catch (error) {
            setError(error.response.data.message);
            Swal.fire({
                icon:"warning",
                text:error.response.data.message
            })
        } finally {
            setIsLoading(false);
        }
    }

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
        {weatherItems.length > 1 && (
            <>
            <Container className="mt-3 p-3 border border-1">
                <Row>
                    <Col md={12} className="fs-3 fw-bold">
                        {weatherItems[0].city_name}
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="fs-6">
                        Period
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="city_weather_period_info mt-1">
                        Starts at: {getFormattedTimestamp(weatherItems[0].timestamp_dt)} UTC

                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="city_weather_period_info mt-1">
                        Ends at: {getFormattedTimestamp(weatherItems[weatherItems.length - 1].timestamp_dt)} UTC
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="mt-1">
                        <button type="button" className="btn btn-success" onClick={saveForecast}>Save forecast</button>
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
                    {weatherItems.map((weatherItem, key) => (                      
                        <tr className="city_weather_row text-start" key={key}>
                        <td className="text-start">{getFormattedTimestamp(weatherItem.timestamp_dt)}</td>
                        <td className="text-start">{weatherItem.min_tmp} °C</td>
                        <td className="text-start">{weatherItem.max_tmp} °C</td>
                        <td className="text-start">{weatherItem.wind_spd} km/h</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </>
            )}
    </div>
    );
}