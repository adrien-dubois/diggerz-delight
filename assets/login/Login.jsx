import React, { useCallback, useRef } from "react"
import { render, unmountComponentAtNode } from "react-dom"
import { getToken } from "../comments/hooks"
import { Icon } from "../components/Icon"
import { Name, Password } from "./LoginForm"

function Login () {
    /*------ VARIABLES ------*/
    const email = useRef(null)
    const password = useRef(null)

    /*------ HOOKS ------*/
    const url = 'api/login_check'
    const {load, loading, errors, clearError} = getToken(url)

    /*------- METHOD------*/
    const onSubmit = useCallback(e => {
        e.preventDefault()
        load({
            username : email.current.value,
            password : password.current.value,
        })
    }, [email, password])

    return <div>
        <form onSubmit={onSubmit} className="input-form" >
            <Icon icon="user-circle"/>
            
            <Name
               ref={email}
               required
               onChange={clearError.bind(this, 'email')}
               error={errors['message']}
            />
            <Password
                ref={password}
                required
                onChange={clearError.bind(this, 'password')}
                error={errors['message']}
            />
            <input type="hidden" name="_csrf_token"
                value="{{ csrf_token('authenticate') }}"
            />
            <div className="options-01 checkbox">
                <label className="remember-me">
                    <input type="checkbox" name="_remember_me"/>Se souvenir de moi
                </label>
                <a href="">Mot de passe oublié?</a>
            </div>

            <input type="submit" className="btn" value="Login" disabled={loading}/>
        </form> 
    </div>
}

class LoginElement extends HTMLElement {

    connectedCallback () {
        render(<Login/>, this)
    }

    disconnectedCallback () {
        unmountComponentAtNode(this)
    }
}

customElements.define('post-login', LoginElement)