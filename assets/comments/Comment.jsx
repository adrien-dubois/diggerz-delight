import { render } from 'react-dom';
import React from 'react';
import { usePaginatedFetch } from './hooks';

function Comments() {

    const {items: comments, load: load, loading: loading} = usePaginatedFetch('comments/')

    return <div>
        {loading && 'Chargement...'}
        {JSON.stringify(comments)}
        <button onClick={load}>Charger les comentaires</button>
    </div>
}

class CommentsElement extends HTMLElement {
    
    connectedCallback () {
        render(<Comments/>, this)
    }

}

customElements.define('post-comments', CommentsElement)