import React, { useEffect, useState } from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from 'axios';
import Swal from 'sweetalert2'
import moment from 'moment';

function getFormattedDates(weatherItems) {
    const firstTimestamp = weatherItems[0]?.timestamp_dt;
    const lastTimestamp = weatherItems[weatherItems.length - 1]?.timestamp_dt;
    const firstDate = moment(firstTimestamp * 1000).format('YYYY-MM-DD, HH:mm:ss A');
    const lastDate = moment(lastTimestamp * 1000).format('YYYY-MM-DD, HH:mm:ss A');
    return { firstDate, lastDate };
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
            console.error('Error fetching weatherItems:', error);
            setError(error.message);
            Swal.fire({
                icon:"error",
                text:error.message
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
        {isLoading ? (
            <p>Data loading...</p>
        ) : error ? (
            <p style={{ color: 'red' }}>Помилка: {error}</p>
        ) : (
            <>              
            {weatherItems.length > 0 && (
                <>
                <Container className="mt-3 p-3 border border-1">
                    <Row>
                        <Col md={12} className="fs-3 fw-bold">
                            {inputValue}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="fs-6">
                            Period
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="city_weather_period_info mt-1">
                            Starts at: {getFormattedDates(weatherItems).firstDate}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="city_weather_period_info mt-1">
                            Ends at: {getFormattedDates(weatherItems).lastDate}
                        </Col>
                    </Row>
                </Container>
                </>
            )}
            
            {weatherItems.length > 0 && (
                <table className="table table-bordered mb-5 text-center">
                    <thead className="text-primary fs-6">
                    <tr>
                        <th className="text-primary">Datetime</th>
                        <th className="text-primary">Min temp</th>
                        <th className="text-primary">Max temp</th>
                        <th className="text-primary">Wind speed</th>
                    </tr>
                    </thead>
                <tbody>
                    {weatherItems.map((city, key) => (                      
                        <tr className="city_weather_row" key={key}>
                        <td>{city.timestamp_dt}</td>
                        <td>{city.min_tmp}</td>
                        <td>{city.max_tmp}</td>
                        <td>{city.wind_spd}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </>
        )}
    </div>
    );
}