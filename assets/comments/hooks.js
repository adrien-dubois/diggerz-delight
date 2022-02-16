import { useState, useCallback } from "react";
import axios from "axios";

export function usePaginatedFetch (url) {

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0)
    const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NDUwMDA5MDksImV4cCI6MTY0NTA0NDEwOSwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQGRpZ2Vyei1kZWxpZ2h0LmZyIn0.RFV-D71LZZc7-3Yz6853SydK8wv2Rg75xnqKYBnlGzEy8MBJFbtRD1uXZKe8N-YyrJCQJ4cr9RBvas5M056NoxxsPSOeOElsk1BS3x7KROCpnNhWMebCKTAG-hzqv_jCfk7yGPiy9hnbM42Dw4S4cX7jN9FhRzbTTiFq6QH7CXnpr2JRgRqHTBHyAnsBkSJwJTkg0afxv2dE7no41miP08_OvUuFwi6eHMs4F0bmtQANDcs-o4Zco4lX8btmyF0COoULAU2fSAZ_T_f_KInDF1pVe7OFif7_m2H8lfCY9EHK3MJZtHKejgCrWoeXPymItLZc9FEAOc3oYU86BWeRew';
    const apiURL = 'http://localhost:8080/api/v1/';

    const authAxios = axios.create({
        baseURL: apiURL,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept : 'application/json'
        }
    })

    const load = useCallback(async () => {
        setLoading(true)
        try{

            const response = await authAxios.get(url)
            setItems(response.data)
            setCount(response.data[0]['totalItems'])
        } catch(err){
            console.log(err.message);
        }

        setLoading(false)
    },[url])
    return {
        count,
        items,
        load,
        loading
    }
    
}