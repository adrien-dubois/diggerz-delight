import { useState, useCallback } from "react";
import axios from "axios";

export function usePaginatedFetch (url) {

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NDUxMzUzNzUsImV4cCI6MTY0NTE3ODU3NSwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQGRpZ2Vyei1kZWxpZ2h0LmZyIn0.h0tRsk-tCCY0weuG7h2atNHfWGZ9aQDgGu8uE6E4NKzIrvIg1s-NAvEhVx4IVR4issRZhU1wxOb3JRzgTIvLoMNPHUWKeBOLiMG_y7W-DIdWML6fbQwmqz6o5NmruRrsBMdvJAgWSC5sejhyzMopkMNRFYYo7cBdiMEU6dJwZqd7miW8JewEq7M-GP1QOmUTLQHd0EyxQ4hf881hKsU2IEHS0yVM1fCc3i60wJ-V0Wqo1GJBeVHzMclOWmmrk15elYHXLztuh0a1N64nODGQHV7mDx5wVu4i1hpxPIEGBDopM_qahDYzQ1VMsn9nzmt06KwcRhEbbKVs9iJU4NtTbw';
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

            const response = await authAxios.get(next || url)

            // console.log(response.data[3]);
            setItems(items => [...items, ...response.data[3]])


            setCount(response.data[0]['totalItems'])

            if (response.data[2] && response.data[2]['next']){
                setNext(response.data[2]['next'])
            } else {
                setNext(null)
            }
           
        } catch(err){
            console.log(err.message);
        }

        setLoading(false)
    },[url, next])
    return {
        count,
        items,
        load,
        loading,
        hasMore: next !== null
    }
    
}