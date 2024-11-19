import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'
import ApiWeather from "./apiWeather.component";
import DbWeather from "./dbWeather.component";

export default function MainWeatherUI() {
    const [inputValue, setInputValue] = useState('');
    const [currentComponent, setCurrentComponent] = useState(null);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };
    
    const handleApiWeather = () => {
        setCurrentComponent(<ApiWeather inputValue={inputValue} />);
    };
    
    const handleDbWeather = () => {
        setCurrentComponent(<DbWeather inputValue={inputValue} />);
    };

    return (
        <div>
            <div className="row d-flex justify-content-center">
                <div className="col-auto">
                    <input type="text" className="form-control" value={inputValue} onChange={handleChange} placeholder="City name"/>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-primary me-2" onClick={handleApiWeather}>Get from API</button>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-warning me-2" onClick={handleDbWeather}>Get from DB</button>
                </div>
            </div>      
            {currentComponent}
        </div>
    );

}
