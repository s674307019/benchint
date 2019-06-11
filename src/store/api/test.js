import Xsync from 'Xsync'

export function testAjax({params}) {
    return new Promise((resolve, reject) => {
        Xsync({
            method: 'GET',
            url: 'api/v2/movie/top250',
            params,
            token: 'token-token'
        }).then(res => {
            console.log('then:', res);
            resolve(res)
        }).catch(err => {
            console.log('catch:', err);
            reject(err)
        });
    })
}