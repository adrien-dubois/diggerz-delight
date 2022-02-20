import { useState, useCallback } from "react";
import axios from "axios";


const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NDUzNTE3NDYsImV4cCI6MTY0NTM5NDk0Niwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQGRpZ2Vyei1kZWxpZ2h0LmZyIn0.jVI3S60QjlJMePCowpY7zTgtt17SJeS2P3LOrcyygW_ZIc6FZcEu9n80vcsd5dl_paDmBCO7A9zWEOnfsDsL1jygc19RK0fHVMfHyXFr1tejmAK0N7RiNJMvGXzuwAd7Oh9wJ8QG8o0VIHlnttJOKw_2RDfHQUzkenGv6AohzcDapV-Q9cOyi7ash39ed3DUnlbvlf0FkbzmDE7IKKlJXYRnxqXqOrG5nYqVlgsG_DZ9otSIIG3flj9FLP1tQuRhWVAFEHAyPpyq0GQLq-MqC8QqEYNako6FKl0gvf3HywXwbQYgCbRJ55oFyXjswmHUxsRx7VVSBV2felh5thIkMQ';
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
        setItems,
        load,
        loading,
        hasMore: next !== null
    }
    
}

export function useFetch (url, method, callback=null){
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const load = useCallback(async (data = null) => {
        setLoading(true)
        
        const params = JSON.stringify(data)
        try {
            const response = await authAxios[method](url, params)
            const responseData = response.data
            
            setLoading(false)
            if(callback){
                callback(responseData)
            }
           
            
        } catch (error) {
            setLoading(false)
            // console.log(error.response.data);
            const err = error.response.data
            setErrors(err.violations.reduce((acc, violations) =>{
                acc[violations.propertyPath] = violations.title
                return acc
            },{} ))
        }
    }, [url, callback])
    const clearError = useCallback((name) => {
        if(errors[name]){

            setErrors(errors => ({...errors, [name]: null}))
        }
    }, [errors])
    return {
        load,
        loading,
        errors,
        clearError
    }
}