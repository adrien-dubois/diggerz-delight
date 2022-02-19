import { useState, useCallback } from "react";
import axios from "axios";


const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NDUyNzgwMDUsImV4cCI6MTY0NTMyMTIwNSwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQGRpZ2Vyei1kZWxpZ2h0LmZyIn0.QZUQhuIVlV28O6eoHOywc1yHP_yppm3oVu8vFY7ZN114BczIvOj9G2lw8dhso1Z1urBPlErW7RD8Sw29_2wk2Ql0C3Bc4Rmgau_yZ9gJYqFgWVnPShMVF1it3VJgmZw4Vxy6vdVKlZUgBurgEJ7I9d5RVEOZErtN-YZykIo4VlmugRVLfyBsa1nUXFr_eW63v23FbCnfTum99GYmnAXuzx9TprlJCb1jZ8cmgGOd0coo10f8KMwCKqwSgD5qRXV-Eab4BMaoKAh_fQCnhnuOFV4xSrQwSvsGh522CRLGEbYZwx5wz2ik0XZ7ydco8vZ3-96wOaGl71nudOZHMwxs3Q';
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

export function useFetch (url, callback=null){
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const load = useCallback(async (data = null) => {
        setLoading(true)
        
        const params = JSON.stringify(data)
        try {
            const response = await authAxios.post(url, params)
            const responseData = response.data
            
            if(callback){
                callback(responseData)
            }
           
            
        } catch (error) {
            // console.log(error.response.data);
            const err = error.response.data
            setErrors(err.violations.reduce((acc, violations) =>{
                acc[violations.propertyPath] = violations.title
                return acc
            },{} ))
        }
        setLoading(false)
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