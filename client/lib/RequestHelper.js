import ReactOnRails from 'react-on-rails';
import axios from 'axios';

export default class RequestHelper {
  constructor() {
    this.defaultParams = {
      credentials: 'same-origin'
    };
  }

  defaultHeaders() {
    return ReactOnRails.authenticityHeaders();
  }

  get(url) {
    return axios({
      url: url,
      timeout: 20000,
      method: 'get',
      responseType: 'json',
      ...this.defaultParams
    }).then(function(response) {
      return response;
    });
  }

  post(url, props) {
    return axios({
      url: url,
      headers: this.defaultHeaders(),
      timeout: 20000,
      method: 'post',
      responseType: 'json',
      body: JSON.stringify(props),
      ...this.defaultParams
    }).then(function(response) {
      return response;
    });
  }

  put(url, props) {
    return axios({
      url: url,
      headers: this.defaultHeaders(),
      timeout: 20000,
      method: 'put',
      responseType: 'json',
      body: JSON.stringify(props),
      ...this.defaultParams
    }).then(function(response) {
      return response;
    });
  }

  delete(url) {
    return axios({
      url: url,
      headers: this.defaultHeaders(),
      timeout: 20000,
      method: 'delete',
      responseType: 'json',
      ...this.defaultParams
    }).then(function(response) {
      return response;
    });
  }
}
