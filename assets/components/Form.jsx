import React from "react"

const className = (...arr) => arr.filter(Boolean).join(' ')

export const Field = React.forwardRef(({
    help, 
    name, 
    children, 
    error, 
    onChange
}, ref) => {

    if (error) {
        help = error
    }

    return <div className={className('form-group', error && 'has-error')}>
        <label 
            htmlFor={name} 
            className="control-label" 
        >
            {children}
        </label>
        <textarea 
            ref={ref} 
            rows="10" 
            className='form-control' 
            name={name} 
            id={name}
            onChange={onChange} 
        />
        {help && <small>{help}</small>}
    </div>
})

export const Input = React.forwardRef(({
    name,
    help,
    children,
    error,
    onChange
},title) =>{
    if(error) {
        help = error
    }

    return <div className={className('form-group', error && 'has-error')}>
        <label 
            htmlFor={name} 
            className="control-label"
        >
            {children}
        </label>
        <input 
            ref={title} 
            className='form-control' 
            name={name} 
            id={name} 
            onChange={onChange}
        />
        {help && <small>{help}</small>}
    </div>
})