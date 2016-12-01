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

  // returns object with consistent structure, whether success or failure:
  // {
  // success: bool
  // status: int
  // message [if !success]: string
  // ...other response fields
  // [error object as well, if error, fyi]
  // }
  sendRequest(axiosRequest) {
    return axios(axiosRequest).then(function(response) {
      return {...response, success: true, message: "Success"};
    }).catch(function(error) {
      // get rails errors from response object, put into nice string
      let betterMessage = "";
      try {
        betterMessage = Object.keys(error.response.data).map(function(error_attr) {
          return error.response.data[error_attr].join(",");
        }).join(",");
      } catch(e) {}
      if (betterMessage.length < 1) {
        betterMessage = error.message;
      }
      return {...error.response, success: false, message: betterMessage, error};
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
