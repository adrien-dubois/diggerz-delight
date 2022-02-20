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

/*---- CURRENT COMMENT CONDITION -----*/
const VIEW = 'VIEW'
const EDIT ='EDIT'

/*----- GET THE COMMENTS WITH THE CURRENT ARTICLE -----*/
function Comments({post, user}) {
    const {
        items: comments, 
        setItems: setComments, 
        load, 
        loading, 
        count, 
        hasMore
    } = usePaginatedFetch('comments/post=' + post + '&page=1')

    // When adding comment, we put the new comment on the top of the list
    const addComment = useCallback(comment => {
        setComments(comments => [comment, ...comments])
    }, [])
    

    const deleteComment = useCallback(comment => {
        setComments(comments => comments.filter(c => c !== comment))
    }, [])

    // Callback which receive the new comment after edit, and the old one, before edit. After, we set the comment by mapping the different values
    // And if the commend corresponds to the old comment -> we return the new one. If not, we return the comment as it is
    const updateComment = useCallback((newComment, oldComment) => {
        setComments(comments => comments.map(c => c === oldComment ? newComment : c))
    }, [])

    useEffect(() => {
        load()
    }, [])

    return <div>
        {/* displaying the actual number of comments */}
        <Title count={count} />
        {/* If user is connect we can display the comment form */}
        {user && <CommentForm post={post} onComment={addComment}/>}
        {comments.map(comment => 
            <Comment 
                key={comment.id} 
                comment={comment} 
                canEdit={comment.user.id === user} 
                onDelete={deleteComment}
                onUpdate={updateComment}
            />
        )}
        {hasMore && <button disabled={loading} className='bouton' onClick={load} >Plus de commentaires</button>}
    </div>
}


/*----- READ COMMENTS DATA BLOCK -----*/
/* and manage options like delete & edit */
const Comment = React.memo(({comment, onDelete, canEdit, onUpdate}) => {

    /*-------- DATAS -------- */
    // stock the date whitch the comment was published
    const date = new Date(comment.createdAt)

    /*------- EVENTS ------- */

    // Method which toggle condition(state), make a set state & if the state is "view", it switches on edit, vice versa
    const toggleEdit = useCallback(() => {
        setState(state => state === VIEW ? EDIT : VIEW )
    }, [])

    // Callback which get the comment to delete on argument and send it to onDelete method, and the callback depends on the comment
    const onDeleteCallback = useCallback(() => { onDelete(comment) }, [comment])

    // This callback depends on the selected comment, the methods calls, the parent method with the new commment sent by the api, and the new one
    const onComment = useCallback ((newComment)=> {
        onUpdate(newComment, comment)
    }, [comment])


    /*------- HOOKS -------*/
    // Variable state which allows me to know the current condition
    const [state, setState] = useState(VIEW)
    // Hook call to delete
    const{loading: loadingDelete, load: callDelete} = useFetch('comments/' + comment['id'], 'delete', onDeleteCallback)

    /*-------- RENDER RETURN --------*/
    return <div className="row">

        {/* META DATAS ABOUT COMMENT */}
            <h4 className="column-3 post-comment">
                {/* user name */}
                <strong>{comment.user.fullName}</strong>
                commenté le
                {/* date */}
                <strong>{date.toLocaleString(undefined, dateFormat)}</strong>
            </h4>
        {/* THE COMMENT ITSELF */}
            <div className="column-9">
                {/* title & comment */}
                {state === VIEW ?
                    <p><strong>{comment.title}</strong><br /> {comment.text}</p> :
                    <CommentForm comment={comment} onComment={onComment}/>
                }

                {/* if not in edition mode, then display action buttons */}
                {(canEdit && state !== EDIT) && <p>

                    {/* Delete Button */}
                    <button className='ctaBtn ctaBtn--del' onClick={callDelete.bind(this, null)} disabled={loadingDelete} >
                        <Icon icon="trash"/>
                    </button>
                    {/* Edit Button */}
                    <button className='ctaBtn ctaBtn--edit' onClick={toggleEdit} disabled={loadingDelete} >
                        <Icon icon="pen"/>
                    </button>
                </p>}
            </div>
        </div>
     
})


/*----- FORM COMMENT -----*/
const CommentForm = React.memo(({post = null, onComment, comment = null}) => {

    /*------ VARIABLES ------*/
    const ref = useRef(null)
    const title = useRef(null)
    
    /*------ HOOKS ------*/
    const {load, loading, errors, clearError} = useFetch('comments/', 'post',onSuccess)

    /*------- METHODS ------*/
    // If comment is posted, then reset fields value
    const onSuccess = useCallback(comment => {
        onComment(comment)
        ref.current.value = ''
        title.current.value = ''
    }, [ref, title, onComment])

    const onSubmit = useCallback(e => {
        e.preventDefault()
        load({
            title: title.current.value,
            text: ref.current.value,
            post: post
        })
    }, [load, ref, post])


    /*-------- EFFECTS -------*/

    // This useEffect observe the comment
    // if comment, comment.content & ref are defined so ref value is egal to the comment content
    useEffect(() => {
        if(comment && comment.text && ref.current && comment.title && title.current){
            ref.current.value = comment.text
            title.current.value = comment.title
        }
    }, [comment, ref])

    /*------ RETURN RENDER -------*/
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