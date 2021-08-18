export default class NetUtil {
    static HOST_API="http://finance-epa-service.k8sdevwksoa.10.66.226.2.k8sdev-wks.k8s.wistron.com";
    // static HOST_API="http://localhost:8006/";
    static API = {

        findAll: '/costEa/findAll',



    }
    static post(url, params) {
        const real_url = this.HOST_API + url;
        return new Promise((resolve, reject) => {
            fetch(real_url, {
                method: "POST",
                mode: "cors",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(params)
            })
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }




}