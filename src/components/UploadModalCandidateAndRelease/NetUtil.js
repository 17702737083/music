export default class NetUtil {
    //192.168.66.57localhost
    static Candidate_API = "http://192.168.66.57:8015/users";
    static API = {
        uploadCandidateList: "/uploadCandidateListAndRelease"
    }
    static post(url, params) {
        const real_url = this.Candidate_API + url;
        return new Promise((resolve, reject) => {
            const formdata = new FormData();
            formdata.append('file', params);
            fetch(real_url, {
                method: "POST",
                mode: "cors",
                body: formdata,
                 //responseType: "blob"
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
    // request("http://192.168.66.57:8015/xuqian/downloadtemplate", {
    //     params,
    //     responseType: "blob"
    //   }).then(res => {
    //     const a = document.createElement("a")
    //     a.href = URL.createObjectURL(res)
    //     a.click()
    //     URL.revokeObjectURL(a.href)
    //     a.remove();
    //   });
}





