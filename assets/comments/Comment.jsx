import { render } from 'react-dom';
import React, { useEffect } from 'react';
import { usePaginatedFetch } from './hooks';
import { Icon } from '../components/Icon';

// Display published date with month and hours with no secs 
const dateFormat = {
    dateStyle: 'medium',
    timeStyle: 'short'
}

function Comments() {

    const {items: comments, load: load, loading: loading, count, hasMore} = usePaginatedFetch('comments/post=1&page=1')

    useEffect(() => {
        load()
    }, [])

    return <div>
        <Title count={count} />
        {comments.map(comment => <Comment key={comment.id} comment={comment}/>)}
        {hasMore && <button disabled={loading} className='bouton' onClick={load} >Plus de commentaires</button>}
    </div>
}

const Comment = React.memo(({comment}) => {

    // stock the date in this const
    const date = new Date(comment.createdAt)
    return <div className="row">
            <h4 className="column-3 post-comment">
                <strong>{comment.user.fullName}</strong>
                commenté le
                <strong>{date.toLocaleString(undefined, dateFormat)}</strong>
            </h4>
            <div className="column-9">
                <p>{comment.text}</p>
            </div>
        </div>
     
})

function Title({count}) {
    return <h3 className='comTitle'>
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