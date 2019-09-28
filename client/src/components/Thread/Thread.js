import React, { useContext, useState, useRef } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { GlobalContext } from '../../context/Global'
import parse from '../../utility/bbcparser'

const LOAD_THREADS = gql`
{
  topics {
     threads {
        postCount
     }
  }
}
`

const GET_THREAD = gql`
  query Thread($id: ID!) {
   threadById(id: $id) {
      id
      title
      content
      posts {
         id
         text
         by {
            name
         }
      }
      by {
         name
      }
    }
  }
`;

const POST_ON_THREAD = gql`
   mutation PostOnThread($thread: ID! $text: String!) {
      createPost(data: {thread: $thread text: $text}){
         text
      }
   }
`

const Thread = (props) => {
   const elemref = useRef()
   const [text, setText] = useState('')
   const context = useContext(GlobalContext)
   const id = props.match.params.id
   const { loading, error, data } = useQuery(GET_THREAD, {
      variables: { id }
   })


   // { data: postData, error: postError } in useMutation if you want access to results
   const [post] = useMutation(POST_ON_THREAD, {
      variables: { thread: id, text },
      refetchQueries() {
         return [{ query: GET_THREAD, variables: { id } }, { query: LOAD_THREADS }]
      }
   })

   if (error) {
      return <div className="container"> <p className="medium"> Thread does not exists</p> </div>
   }

   return (
      <div className="container">
         {!loading && data && data.threadById &&
            <div className="thread">
               <button onClick={props.history.goBack} className="thread__back"> Go back </button>
               <h1 className="center bb big"> {data.threadById.title} </h1>
               <div className="thread__title">
                  <div className="thread__card">
                     <div className="thread__card--user">
                        <h3> {data.threadById.by.name} </h3>
                        <img className="round-img" alt="avatar" src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"></img>
                     </div>
                     <p> <strong className="medium">{data.threadById.content}</strong> </p>
                  </div>
               </div>
               {data.threadById.posts.length > 0 ? <div className="thread__posts">
                  {data.threadById.posts.map(post => {
                     return <div ref={elemref} key={post.id} className="thread__card--post">
                        <div className="left">
                           <h3> {post.by.name} </h3>
                           <img className="round-img" alt="avatar" src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"></img>
                           <span className="cite" onClick={e =>
                              setText(`${text}[QUOTE=${post.by.name}] ${post.text} [/QUOTE]`)
                           }>Cite</span>
                        </div>
                        <div className="right" dangerouslySetInnerHTML={parse(post.text)}></div>
                     </div>
                  })}
               </div> : <h3 className="medium center mb">No posts here yet.</h3>}
               <div className="thread__create">
                  {context.isAuth ? <form className="form" onSubmit={e => {
                     e.preventDefault()
                     post()
                     setText('')
                  }}>
                     <textarea cols="20" rows="10" onChange={e => setText(e.target.value)} value={text} type="text" placeholder="Post something" />
                     <input type="submit" placeholder="Submit" className="btn btn-primary" />
                  </form> : <p style={{ marginTop: 'auto' }} className="medium">You need to be logged in to comment on threads.</p>}
               </div>
            </div>
         }
      </div>
   )
}

export default Thread


/*

      const { loading: ladds, error: errs, data: dats } = useQuery(gql`
      query {
         currentUser{id name}
      }
   `)


 */