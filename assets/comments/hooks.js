import { useState, useCallback } from "react";
import axios from "axios";


async function jsonFetch ( url, method = 'GET', data = null ) {

    const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NDUxNzk0NDcsImV4cCI6MTY0NTIyMjY0Nywicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQGRpZ2Vyei1kZWxpZ2h0LmZyIn0.PFjQMJFSijR86JeBhx2ETmo3-IJ8Hg72NnfSDsTbqj3uFV0tVW1z0xzN_Z_dZKtn4dTCVPSn4S-3jCwL2YZuBPcVZmKsKb7KzPjzKi5KTwAZto4xPdJ-L_eyBRQHFT-NZuS5nIFEa3PFqdhbwwzIHMe9t1fhMwUJrHHyi-VDWYPQiOLTlH6Az2cA2sc1nvM2ImeZ59UO92qRTrx6jmr6OcJh1aFjQ5R8bISA7nqB4KTCEIxoV0r_vRChgukX-LDgEwQI2MIA14shKj9l5mWPtlnD7e4ix1sz3Y4xxxAXMy5g7KA1kfbYwbc7KPeVJ5aknLQ_tmiQbZhbWdXXBSYviA';
    const apiURL = 'http://localhost:8080/api/v1/';


    const authAxios = axios.create({
        baseURL: apiURL,
        method: method,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept : 'application/json',
            'Content-Type' : 'application/json' 
        }
    })

    if (data) {
        authAxios.body = JSON.stringify(data)
    }

    const response = await authAxios.get(url)
    const responseData = response.data
    if (response.status === 204 ) {
        return null
    }
    if (response.status === 200){
        console.log('test');
        return responseData
    } else {
        throw responseData
    }

}

export function usePaginatedFetch (url) {

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);

    const load = useCallback(async () => {
        setLoading(true)
        try{

            const response = await jsonFetch(next || url)

            // console.log(response.data[3]);
            setItems(items => [...items, ...response[3]])
            setCount(response[0]['totalItems'])

            if (response[2] && response[2]['next']){
                setNext(response[2]['next'])
            } else {
                setNext(null)
            }
           
        } catch(err){
            console.error(err.message);
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

export function useFetch (url, method='POST'){
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const load = useCallback((data) => {

    }, [url, method])
}