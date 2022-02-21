import { useState, useCallback } from "react";
import axios from "axios";


const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NDUzOTU1NTUsImV4cCI6MTY0NTQzODc1NSwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQGRpZ2Vyei1kZWxpZ2h0LmZyIn0.I5iNrvfrYrpJL2tBy1xrFFwcyxJ-kfRrx16GtNXoanXgsdw_uKF6q9xXNW4-5bmWCztJzdYe630lW2o3g9-UkRlSLyfgOTOKITgqawR3iEzrurlQxsFPNmMW2FrICw2ttc1117jbofVrB32s6AEyEd2DYTQEAuZlXHiE1xdOKN-MAGmsawJmwXgwkEKsCIpIqqZBLAeW71J0mIl_ubUo-fB0qHZbe654k71vE_NSq8T3CJGJZujF-qFQyAarkw1FRBbm3SI1RWgjFFUA5xiQ5HzCYgQppoQrvrgFLJyom5MKHd1rDPcN2MbxzKmxqSl8LwqnsQhtRxZufcUPcHUwqQ';
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
            // console.log(error.response.data);
            setLoading(false)
            // console.log(error.response.status);
            // console.log(error.response.headers);
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