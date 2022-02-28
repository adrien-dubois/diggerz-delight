import { useState, useCallback } from "react";
import axios from "axios";


const accessToken = localStorage.getItem('jwt');
const apiURL = 'http://localhost:8080/';


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

export function getToken(url){
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const tokenAxios = axios.create({
        baseURL: apiURL,    
        headers: {
            Accept : 'application/json',
            'Content-Type' : 'application/json' 
        }
    })
    const load = useCallback(async (data = null) => {
        setLoading(true)

        const params = JSON.stringify(data)

        try{
            const response = await tokenAxios.post(url, params)
            const token = response.data['token']
            localStorage.setItem('jwt', token)
            tokenAxios.post('/login', params)
            setLoading(false)

        }
        catch(error){
            setLoading(false)
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
    }, [url])
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