export default class NetUtil {
    //192.168.66.57localhost
    static Xuqian_API = "http://192.168.66.57:8015/xuqian";
    static API = {
        uploadXuqian: "/uploadXuqian"
    }
    static post(url, params) {
        const real_url = this.Xuqian_API + url;
        return new Promise((resolve, reject) => {
            const formdata = new FormData();
            formdata.append('file', params);
            fetch(real_url, {
                method: "POST",
                mode: "cors",
                body: formdata,
            }
            )
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

}





