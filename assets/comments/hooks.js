import { useState, useCallback } from "react";
import axios from "axios";


const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NDUyMjI5MDgsImV4cCI6MTY0NTI2NjEwOCwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQGRpZ2Vyei1kZWxpZ2h0LmZyIn0.nOGZoD4jmO7ENsM_M3yXGDR9pu8o_FL4_7jfvg4sitdNY-sdhkuzgQ1K41zEc0zP4JFbpPiKctqEux9c2pJXzAlId9x0tH5naA7NCLNu8wcJn7Mq45yjr6boJfi3wQcEmofjfLwRyQVnWtVzZrH49zzaECy53R_0qYirDbjpa4Ly8ysWN_OW5H2yfV_qMlmpgFZnw2XVAaBD29PKNRfJKaFi1AM08q3gWpgzn-eX3M44-geRM3el-r6w-R_ekRKMwqyl2kHmbE85uO8kHGVtg_C_7POTbewXGOd4MIMEE5QJuh0Q4egnKNZWbQEUUIjWCPcesz7x-cak_no33sB2Yg';
const apiURL = 'http://localhost:8080/api/v1/';


const authAxios = axios.create({
    baseURL: apiURL,
    headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept : 'application/json',
        'Content-Type' : 'application/json' 
    }
})

export function usePaginatedFetch (url) {

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);

    const load = useCallback(async () => {
        setLoading(true)
        try{

            const response = await authAxios.get(next || url)
            const responseData = response.data
            // console.log(response.data[3]);
            setItems(items => [...items, ...responseData[3]])
            setCount(responseData[0]['totalItems'])

            if (responseData[2] && responseData[2]['next']){
                setNext(responseData[2]['next'])
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

export function useFetch (url, callback=null){
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const load = useCallback(async (data = null) => {
        setLoading(true)
        
        const params = JSON.stringify(data)
        try {
            const response = await authAxios.post(url, params)
            // const responseData = response.data
            
            if(callback){
                callback(response)
            }
           
            
        } catch (error) {
            console.log(error.response.data);
            const err = error.response.data
            setErrors(err.violations.reduce((acc, violations) =>{
                acc[violations.propertyPath] = violations.title
                return acc
            },{} ))
        }
        setLoading(false)
    }, [url, callback])
    return {
        load,
        loading,
        errors
    }
}