import { useState, useCallback } from "react";
import axios from "axios";

export function usePaginatedFetch (url) {

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NDUwODg2OTIsImV4cCI6MTY0NTEzMTg5Miwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQGRpZ2Vyei1kZWxpZ2h0LmZyIn0.Ef4dDHKHAvIcD5LUmStXYx_3SVhXiVCBamXkkfoPmazYUvBiSCKxXLg2cZMuRpMXjsEdhWC-NRYCdasKBggm9RUJIrGhYRmfaW19DRBxGg-4U1GzYxoUgzz6UwfFHkxLtREEgcWlAGPJwEIgLofAgaawA_envzwT_xu50R_QplxoY1v4Gg5nSPB_2g-7uWFRIeuTu84OuM2UkQRyjk7WS3MnUsIUVZL6gRFvFNsL2R82YXEg3-M8MfyjIERBniYrbbVW0JtpCrzpjq6s3ote-SbzThLdgf0G_KK6URuBDgCbob2gwiJHU0pRzcfzCKhws4wRaao6hNk6-kLp9ubT0g';
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