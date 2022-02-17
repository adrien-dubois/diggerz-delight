import { render, unmountComponentAtNode } from 'react-dom';
import React, { useEffect } from 'react';
import { usePaginatedFetch } from './hooks';
import { Icon } from '../components/Icon';

// Display published date with month and hours with no secs 
const dateFormat = {
    dateStyle: 'medium',
    timeStyle: 'short'
}

function Comments({post, user}) {
    const {items: comments, load, loading, count, hasMore} = usePaginatedFetch('comments/post=' + post + '&page=1')

    useEffect(() => {
        load()
    }, [])

    return <div>
        <Title count={count} />
        {user && <CommentForm post={post}/>}
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

function CommentForm({post}){
    return <div className="formComment">
        <form>
            <fieldset>
                <legend><Icon icon="comment"/> Laisser un commentaire</legend>
                <div className="form-group">
                    <textarea name="" id="" cols="30" rows="10" className='form-control' ></textarea>
                </div>
            </fieldset>
        </form>

    </div> 
}

function Title({count}) {
    return <h3 className='comTitle'>
        <Icon icon="comments"/>
        {count} Commentaire{count > 1 ? 's' : ''} 
    </h3>
}


class CommentsElement extends HTMLElement {
    
    connectedCallback () {
        const post = parseInt(this.dataset.post, 10)
        const user = parseInt(this.dataset.user, 10) || null
        
        render(<Comments post={post} user={user}/>, this)
    }

    disconnectedCallback() {
        unmountComponentAtNode(this)
    }

}

customElements.define('post-comments', CommentsElement)