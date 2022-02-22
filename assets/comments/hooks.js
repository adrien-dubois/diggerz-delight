import { useState, useCallback } from "react";
import axios from "axios";


const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NDU0NDM0NTksImV4cCI6MTY0NTQ4NjY1OSwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQGRpZ2Vyei1kZWxpZ2h0LmZyIn0.EL1Tjv03r22cwiBNSirpIkEGle939XI_4noNWdv6idXernaYe-CK80AgQHoPPvBu3PhT37WTDyRSlPlzVNRB6WS3hW9r2-xz2jVCpyBibZDKE2NVe8Dj6q9E4kBkXXutd2GG2r_tTXZO6njvfarUvr-3uQtTKbHFS_NhRus_BrXdZuCDHaQShOl6F4LPRShWd8QBnooNtgU443k4EkpjHHQ3GeJAdzqYZ6ynHDRo_mThYaQk4JQ57ug6ZnXl3K0AfffApPKpXkA4a_TidDAdQwb2TNOyRjA2OcvGnBlKAaia9E5cz1E7swcQCyQbEpX3nqBFCPHX26BzaehE8Lxbzg';
const apiURL = 'http://localhost:8080/api';


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
            if (err.violations){
                setErrors(err.violations.reduce((acc, violations) =>{
                    acc[violations.propertyPath] = violations.title
                    return acc
                },{} ))
            } else {
                setErrors(err)
            }
            
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