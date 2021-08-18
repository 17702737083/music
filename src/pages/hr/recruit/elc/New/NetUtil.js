export default class NetUtil{
    //192.168.66.57localhost
    static HOST_API="http://192.168.66.57:8015/users";
        static API={
         saveById:"/updateuser",
         findByIdnum:"findByIdnum"
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
                }
                )
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
    