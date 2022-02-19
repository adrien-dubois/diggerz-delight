import { render, unmountComponentAtNode } from 'react-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFetch, usePaginatedFetch } from './hooks';
import { Icon } from '../components/Icon';
import { Field, Input } from '../components/Form';

// Display published date with month and hours with no secs 
const dateFormat = {
    dateStyle: 'medium',
    timeStyle: 'short'
}

/*----- GET THE COMMENTS WITH THE CURRENT ARTICLE -----*/
function Comments({post, user}) {
    const {items: comments, setItems: setComments, load, loading, count, hasMore} = usePaginatedFetch('comments/post=' + post + '&page=1')

    const addComment = useCallback(comment => {
        setComments(comments => [comment, ...comments])
    }, [])
    

    const deleteComment = useCallback(comment => {
        setComments(comments => comments.filter(c => c !== comment))
    }, [])

    useEffect(() => {
        load()
    }, [])

    return <div>
        <Title count={count} />
        {user && <CommentForm post={post} onComment={addComment}/>}
        {comments.map(comment => 
            <Comment 
                key={comment.id} 
                comment={comment} 
                canEdit={comment.user.id === user} 
                onDelete={deleteComment}
            />
        )}
        {hasMore && <button disabled={loading} className='bouton' onClick={load} >Plus de commentaires</button>}
    </div>
}


/*----- READ COMMENTS DATA BLOCK -----*/
const Comment = React.memo(({comment, onDelete, canEdit}) => {

    // stock the date in this const
    const date = new Date(comment.createdAt)

    const onDeleteCallback = useCallback(() => {
        onDelete(comment)
    }, [comment])

    const{loading: loadingDelete, load: callDelete} = useFetch('comments/' + comment['id'], 'delete', onDeleteCallback)

    return <div className="row">
            <h4 className="column-3 post-comment">
                <strong>{comment.user.fullName}</strong>
                commenté le
                <strong>{date.toLocaleString(undefined, dateFormat)}</strong>
            </h4>
            <div className="column-9">
                <p><strong>{comment.title}</strong><br /> {comment.text}</p>
                {canEdit && <p>
                    <button className='deleteBtn' onClick={callDelete.bind(this, null)} disabled={loadingDelete} >
                        <Icon icon="trash"/> Supp.
                    </button>
                </p>}
            </div>
        </div>
     
})


/*----- FORM COMMENT -----*/
const CommentForm = React.memo(({post, onComment}) => {

    const ref = useRef(null)
    const title = useRef(null)
    const onSuccess = useCallback(comment => {
        onComment(comment)
        ref.current.value = ''
        title.current.value = ''
    }, [ref, title, onComment])
    const {load, loading, errors, clearError} = useFetch('comments/', 'post',onSuccess)
    const onSubmit = useCallback(e => {
        e.preventDefault()
        load({
            title: title.current.value,
            text: ref.current.value,
            post: post
        })
    }, [load, ref, post])

    return <div className="formComment">
        <form onSubmit={onSubmit}>
            
            <fieldset>
                <legend><Icon icon="comment"/> Laisser un commentaire</legend>
                
                <Input 
                    name="title" 
                    ref={title} 
                    required
                    onChange={clearError.bind(this, 'title')}
                    error={errors['title']}
                >
                    Titre
                </Input>
                <Field 
                    name="text" 
                    help="Les commentaires non conformes à notre charte, seront modérés." 
                    ref={ref} 
                    required
                    onChange={clearError.bind(this, 'text')}
                    error={errors['text']} 
                >
                    Votre commentaire
                </Field>
                <div className="form-group">
                    <button className="bouton" disabled={loading}>
                        <Icon icon="paper-plane"/> Envoyer
                    </button>
                </div>
            </fieldset>
        </form>

    </div> 
})


/*----- GET THE NUMBER OF COMMENTS -----*/
function Title({count}) {
    return <h3 className='comTitle'>
        <Icon icon="comments"/>
        {count} Commentaire{count > 1 ? 's' : ''} 
    </h3>
}


/*----- GET THE ARTICLE ID & THE CURRENT USER ID -----*/
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