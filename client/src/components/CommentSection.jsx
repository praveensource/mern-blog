import { Alert, Button, Textarea, TextInput } from 'flowbite-react'
import { use, useState,useEffect } from 'react'
import {useSelector} from 'react-redux'
import { Link,useNavigate } from 'react-router-dom'
import Comment from './Comment'
import { Modal, ModalHeader, ModalBody } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const CommentSection = ({postId}) => {
  const navigate = useNavigate();
    const [comment,setComment] = useState('')
    const {currentUser} = useSelector((state)=>state.user)
    const [commentError, setCommentError] = useState(null)
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    
    const handleSubmit = async(e) =>{
      e.preventDefault();
      if (comment.length > 200){
        return;
      }
      try {
        const res = await fetch('/api/comment/create',{
        method:"POST",
        headers:{
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({content: comment, postId, userId: currentUser._id})
      })
      const data = await res.json();
      if(res.ok){
        setComment('');
        setCommentError(null);
        setComments([data,...comments])
      }
      } catch (error) {
        setCommentError(error.message);
      }
    };

    useEffect(() => {
  const getComments = async () => {
    try {
      const res = await fetch(`/api/comment/getPostComments/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else {
        console.error("Failed to fetch comments:", res.status);
      }
    } catch (error) {
      console.error("Error fetching comments:", error.message);
    }
  };

  getComments();
}, [postId]);

const handleLike = async(commentId) =>{
  try {
    if(!currentUser){
      navigate('/sign-in');
      return;
    }
    const res = await fetch(`/api/comment/likeComment/${commentId}`,{
      method:"PUT",

    });

    if(res.ok){
      const data = await res.json();
      setComments(comments.map((c) =>
  c._id === commentId
    ? { ...c, likes: data.likes, numberofLikes: data.likes.length }
    : c
));

    }
  } catch (error) {
    console.log(error.message)
  }
}

const handleEdit = async(comment, editComment) =>{
  setComments(
    comments.map((c) => 
    c._id === comment._id ? {...c,content:editComment} : c)
  )
}

const handleDelete = async(commentId) =>{
  setShowModal(false)
  try {
    if(!currentUser){
      navigate('/sign-in');
      return;
    }
    const res = await fetch(`/api/comment/deleteComment/${commentId}`,{
      method:"DELETE",
    })
    if(res.ok){
      const data = await res.json();
      
        setComments(comments.filter((comment) => comment._id != commentId))
     
    }
  } catch (error) {
    console.log(error.message)
  }
}


  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
            <p>Signed in as:</p>
            <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture}  />
            <Link to={'/dashboard?tab=profile'} className='text-sm text-cyan-600 hover:underline'>
                @{currentUser.username}
            </Link>
        </div>
      ):(
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
            You must be signed in to comment. 
            <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
                sign-in please
            </Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
            <Textarea placeholder='Add a comment...' rows={3} maxLength={200} onChange={(e) => setComment(e.target.value)} value={comment} />
            <div className='flex justify-between items-center mt-5'>
                <p className='text-gray-500 text-sm'>{200 - comment.length} characters remaining</p>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-600" outline type='submit'>
                    Submit
                </Button>
            </div>
            {commentError && (
              <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
            )}
        </form>
        
      )}
      {comments.length === 0 ? (
        <p className='text-sm my-5'>No comments posted yet!</p>
      ):(
        <>
        <div className="text-sm my-5 items-center gap-1 flex">
          <p>Comments</p>
          <div className='border border-gray-400 py-1 px-2 rounded-sm'>
            <p>{comments.length}</p>
          </div>
        </div>
        {comments.map(comment => 
          <Comment
           key={
            comment._id}
            comment={comment} onLike={handleLike} onEdit = {handleEdit} onDelete = {(commentId)=>{
              setShowModal(true);
              setCommentToDelete(commentId)
            }}
           />
        )}
        </>
        
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
  <ModalHeader />
  <ModalBody>
    <div className="text-center">
      <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
      <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
        Are you sure you want to delete this comment?
      </h3>

      <div className='flex justify-center gap-4'>
        <Button
          className='bg-red-500'
          outline
          onClick={() => handleDelete(commentToDelete)}
        >
          Yes, I'm sure
        </Button>

        <Button color='gray' onClick={() => setShowModal(false)}>
          No, cancel
        </Button>
      </div>
    </div>
  </ModalBody>
</Modal>

    </div>
  )
}

export default CommentSection
