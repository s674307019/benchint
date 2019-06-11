// import { Modal, message } from 'antd';

const API=''; // dev

/**
 * ajax请求数据封装
 * @param obj - options
 * contentType - 请求头
 * method - 请求方法 ['GET', 'POST']
 * url - 地址
 * params - 数据
 * token - token验证
 *
 * 例：
 * Xsync({
        method: 'GET',
        url: './lib/test.json',
        params: {id: 123},
        token: 'token-token'
    }).then(res => {
        console.log('then:', res);
    }).catch(err => {
        console.log('catch:', err);
    });
 */
export default ({method='GET', url, contentType='application/json', params=null}) => {
// export default ({method='GET', url, contentType='application/x-www-form-urlencoded', params=null}) => {
    return new Promise((resolve, reject) => {
        if (method !== 'GET' && method !== 'POST') {
            reject('Method has to be GET or POST!');
            return;
        }

        const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', contentType);
        // if (TOKEN) xhr.setRequestHeader('token', TOKEN);
        params ? xhr.send(typeof params === 'string' ? params : JSON.stringify(params)) : xhr.send();
        xhr.onreadystatechange = () => {
            const {readyState, status, responseText}=xhr;
            if (readyState !== 4) return;
            if (status >= 200 && status<300 || status === 304) {
                const {code, data, message: msg, errorMessage} = JSON.parse(responseText);
                switch (code) {
                    case -1:
                        // Modal.warning({
                        //     title: '登录过期',
                        //     okText: '重新登录',
                        //     keyboard: false,
                        //     onOk() {
                        //         // 跳转到登录页
                        //         window.location.replace('/#/login');
                        //     }
                        // });
                        reject(errorMessage);
                        break;
                    case 0:
                        resolve(data);
                        break;
                    case 3:
                    default:
                        // message.error(errorMessage || msg || code);
                        reject(errorMessage);
                        break;
                }
            } else {
                // message.error(status);
                reject(status);
            }
        };
    })
};
