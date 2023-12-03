import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios from 'axios';
import { WeatherResponseDto } from './dto';

@Injectable()
export class MeteoService {
  async sevenDaysForecast() {
    // request data from https://open-meteo.com/
    const url = 'https://api.open-meteo.com/v1/forecast';
    const params = new URLSearchParams([
      ['latitude', '44.4323'],
      ['longitude', '26.1063'],
      [
        'daily',
        'temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max',
      ],
      ['timezone', 'GMT'],
    ]);

    const rest = await axios.get(url, { params }).catch((err) => {
      Logger.error('Error when making an API call to ' + url);
      if (err.response) {
        Logger.error(err.response.data);
        Logger.error(err.response.status);
        Logger.error(err.response.headers);
      } else if (err.request) {
        Logger.error(err.request);
      } else {
        Logger.error('ERROR ' + err.message);
      }

      throw new ServiceUnavailableException(
        'Service response represents an error',
        {
          cause: err.config,
        },
      );
    });

    // Process the result received for a easier front-end processing
    const data: WeatherResponseDto = rest.data;
    const transformedData = {
      latitude: data.latitude,
      longitude: data.longitude,
      generationtime_ms: data.generationtime_ms,
      utc_offset_seconds: data.utc_offset_seconds,
      timezone: data.timezone,
      timezone_abbreviation: data.timezone_abbreviation,
      elevation: data.elevation,
      daily_units: data.daily_units,
      daily: {},
    };

    data.daily.time.forEach((val, ind) => {
      transformedData.daily[val] = {
        temperature_2m_max: data.daily.temperature_2m_max[ind],
        temperature_2m_min: data.daily.temperature_2m_min[ind],
        uv_index_max: data.daily.uv_index_max[ind],
        precipitation_probability_max:
          data.daily.precipitation_probability_max[ind],
      };
    });

    // Return it
    return transformedData;
  }
}
