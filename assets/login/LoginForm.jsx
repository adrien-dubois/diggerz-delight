import React from "react";

const className = (...arr) => arr.filter(Boolean).join(' ')

export const Name = React.forwardRef(({
    error,
    required
}, email) => {

    return <div>
            <input 
                ref={email}
                className={className('user-input', error && 'has-error')} 
                type="email" 
                name="email" 
                id="inputEmail" 
                placeholder="E-Mail" 
                autoComplete="email" 
                required={required} 
            />
    </div>
})


export const Password = React.forwardRef(({
    help,
    error,
    required
}, password) => {

    if(error) {
        help = error
    }

    return <div className={className('input-form', error && 'has-error')}>
        <input
            ref={password}
            className="user-input"
            type="password"
            name="password"
            id="inputPassword"
            placeholder="Mot de passe"
            autoComplete="current-password"
            required={required}
        />
        {help && <small>{help}</small>}
    </div>
})