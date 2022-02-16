import { useState, useCallback } from "react";
import axios from "axios";

export function usePaginatedFetch (url) {

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NDUwNDQ5ODAsImV4cCI6MTY0NTA4ODE4MCwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQGRpZ2Vyei1kZWxpZ2h0LmZyIn0.TCOEtt0jwai2hYm5GoiGaXb3Vadz1rIRPEKyKn54LjlhvC6bg140sdd3U-Ow9qmAraBBi3ki8MiELjW2pr8p-VzMKnzUXhgyYmi-Z2F2rOzHk8l_dbZIFR3e_oml6E-ewMilKz2fELZ6ri-rQFWIvV_e4MPss1XWq9Uwm8E4Ws9yZTYJinIh1tLnPJFdEEFi3b6WiuCZZLcYYSs5irONzxYlUgonILrJfCYggpOarYSLDkH0Yx8pjqbzTsdQfaM29r1ks6g6OngdUQrA0UcqssUTyIpPFLr7KX2IPKvppiXTeXkbxy5kGfleygupBtfrMxUTpkdDZabAS-5EntLvZA';
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
            if (response.data[2] && response.data[2]['next']){
                setNext(response.data[2]['next'])
            } else {
                setNext(null)
            }
            console.log(response.data);
        } catch(err){
            console.log(err.message);
        }

        setLoading(false)
    },[url])
    return {
        count,
        items,
        load,
        loading,
        hasMore: next !== null
    }
    
}