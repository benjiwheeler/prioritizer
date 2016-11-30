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

  sendRequest(axiosRequest) {
    return axios(axiosRequest).then(function(response) {
      return {success: true, response};
    }).catch(function(error) {
      return {success: false, error};
    });
  }

  get(url) {
    return this.sendRequest({
      url: url,
      timeout: 20000,
      method: 'get',
      responseType: 'json',
      ...this.defaultParams
    });
  }

  post(url, props) {
    return this.sendRequest({
      url: url,
      headers: this.defaultHeaders(),
      timeout: 20000,
      method: 'post',
      dataType: 'json',
      responseType: 'json',
      data: props,
      ...this.defaultParams
    });
  }

  put(url, props) {
    return this.sendRequest({
      url: url,
      headers: this.defaultHeaders(),
      timeout: 20000,
      method: 'put',
      dataType: 'json',
      responseType: 'json',
      data: props,
      ...this.defaultParams
    });
  }

  delete(url) {
    return this.sendRequest({
      url: url,
      headers: this.defaultHeaders(),
      timeout: 20000,
      method: 'delete',
      responseType: 'json',
      ...this.defaultParams
    });
  }
}
