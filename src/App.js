import './App.css';
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './css/swipper.css';

function App() {
    const [data, setData] = useState(null);
    const [position, setPosition] = useState([null, null]);
    const [ville, setVille] =  useState(null)
    const [isLoading, setLoading] = useState(true);
    const [actualWeather,  setActuelWeather] = useState(null)

    useEffect(() => {
        const fetchPosition = async () => {
            const pos = await Geolocalisation(); // Assuming this returns a promise that resolves to [lat, lon]
            setPosition(pos);
            setLoading(false);
        };

        fetchPosition();
    }, []);

    useEffect(() => {
        if (position[0] && position[1]) {
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${position[0]}&lon=${position[1]}&appid=b336af79478736d4ca65a9ce41592a41&units=metric&lang=fr`)
                .then(response => response.json())
                .then(data => {
                    setData(groupByDay(data.list));
                    setVille(data['city'].name)
                });
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position[0]}&lon=${position[1]}&appid=b336af79478736d4ca65a9ce41592a41&units=metric&lang=fr`)
                .then(response => response.json())
                .then(data => {
                    setActuelWeather(data)
                });
        }
    }, [position]);
    if (!isLoading) {
        return (
            <div className="App">
                <header className="App-header">
                    {data && (
                        <div className={'w-100'}>
                            <h2>{ville}</h2>
                            <div>
                                <figure>
                                    <img src={`https://openweathermap.org/img/wn/${actualWeather.weather[0].icon}@2x.png`}
                                         alt="Weather Icon"/>
                                    <span className={'h4'}>{actualWeather.weather[0].description}</span>
                                    <figcaption>{Math.round(actualWeather.main.temp)}°C</figcaption>
                                </figure>
                            </div>

                            {Object.keys(data).map((day, index) => (
                                <div key={index}>
                                    <h3>{getDayName(new Date(day))}</h3>
                                    <Swiper
                                        className={'w-50'}
                                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                                        spaceBetween={1}
                                        slidesPerView={2}
                                        navigation
                                        pagination={{clickable: true }}
                                        scrollbar={{ draggable: true }}
                                        onSwiper={(swiper) => console.log(swiper)}
                                        onSlideChange={() => console.log('slide change')}
                                    >
                                        {data[day].map((weather, idx) => (
                                            <SwiperSlide className={'d-flex flex-wrap w-50'} key={idx}>
                                                <figure>
                                                    <p>{new Date(weather.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather Icon" />
                                                    <span className={'h4'}>{weather.weather[0].description}</span>
                                                    <figcaption>{Math.round(weather.main.temp)}°C</figcaption>
                                                </figure>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            ))}
                        </div>
                    )}
                </header>
            </div>
        );
    } else {
        return (
            <div>Loading</div>
        );
    }
}

// Function to group weather data by day
function groupByDay(weatherList) {
    return weatherList.reduce((acc, weather) => {
        const date = weather.dt_txt.split(' ')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(weather);
        return acc;
    }, {});
}

// Function to get the day name in French
function getDayName(date) {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[date.getDay()];
}

async function Geolocalisation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve([latitude, longitude]);
            },
            (error) => {
                reject(error);
            }
        );
    });
}

export default App;