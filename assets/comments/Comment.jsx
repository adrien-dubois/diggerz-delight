import { render } from 'react-dom';
import React, { useEffect } from 'react';
import { usePaginatedFetch } from './hooks';
import { Icon } from '../components/Icon';

function Comments() {

    const {items: comments, load: load, loading: loading, count, hasMore} = usePaginatedFetch('comments/post=1&page=1')

    useEffect(() => {
        load()
    }, [])

    return <div>
        {loading && 'Chargement...'}
        {JSON.stringify(comments)}
        <Title count={count} />
        <button onClick={load}>Charger les comentaires</button>
        {hasMore && <button className='bouton'>Plus de commentaires</button>}
    </div>
}

function Title({count}) {
    return <h3>
        <Icon icon="comments"/>
        {count} Commentaire{count > 1 ? 's' : ''} 
    </h3>
}


class CommentsElement extends HTMLElement {
    
    connectedCallback () {
        render(<Comments/>, this)
    }

}

customElements.define('post-comments', CommentsElement)