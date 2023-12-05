import axios from "axios";
import { useQuery } from "react-query";

const WEATHER_URL = "http://localhost:3300/meteo/forecast";

const fetchWeatherInfo = async () => {
  const response = await axios.get(WEATHER_URL, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    }
  });
  return response.data;
}

const WeatherInfo = function (props: { isLoggedIn: boolean }) {
  const { isLoggedIn } = props;
  if (!isLoggedIn) {
    return <div>Please login to continue</div>
  }

  const { isLoading, isError, error, data } = useQuery<any, Error>("weather-forecast", fetchWeatherInfo, {
    cacheTime: 5 * 60 * 1000,
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Loading weather forecast...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  console.log(data);

  return <>
    <div className="text-3xl">
      Weather forecast
    </div>
    <div className="flex flex-col px-16 pt-8">
      <div className="border border-red-200 rounded-t-md bg-gradient-to-b from-red-300 to-red-700 flex flex-row justify-around text-gray-50">
        <div className="w-32">Date</div>
        <div className="w-64">Min Temp - Max temp</div>
        <div className="w-64">UV Index</div>
        <div className="w-64">Max Precipitation Probability</div>
      </div>
      {
        Object.keys(data.daily).map((dayStr: any) => {
          return (
            <div key={dayStr} className="border border-slate-200 flex flex-row justify-around">
              <div className="w-32">{dayStr}</div>
              <div className="w-64">{data.daily[dayStr].temperature_2m_min + " " + data.daily_units.temperature_2m_min + " - " + data.daily[dayStr].temperature_2m_max + " " + data.daily_units.temperature_2m_max}</div>
              <div className="w-64">{data.daily[dayStr].uv_index_max + " " + data.daily_units.uv_index_max}</div>
              <div className="w-64">{data.daily[dayStr].precipitation_probability_max + " " + data.daily_units.precipitation_probability_max}</div>
            </div>
          )
        })
      }
    </div >
  </>
}

export default WeatherInfo;