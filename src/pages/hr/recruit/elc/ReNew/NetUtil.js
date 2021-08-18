export default class NetUtil {
    //192.168.66.57localhost
    static Xuqian_API = "http://192.168.66.57:8015/xuqian";
    static API = {
        saveById: "/updatexuqian",
        findByIdnum: "/findByIdnum"
    }
    static post(url, params) {
        const real_url = this.Xuqian_API + url;
        return new Promise((resolve, reject) => {
           
            fetch(real_url, {
                method: "POST",
                mode: "cors",
                headers: { 
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(params)
            }
            )
                .then(data => {
                    // console.log(data);
                    resolve(data);
                })
               
        });
    }

}