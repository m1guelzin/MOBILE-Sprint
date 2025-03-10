import  axios  from "axios";

const api = axios.create({
    baseURL:"http://10.89.240.75:5000/api/v1",
    headers:{
        "accept":"application/json"
    }
});

const sheets = {
    postCadastro:(user)=>api.post("/user", user)
}

export default sheets;