import { Button } from 'flowbite-react'
import React from 'react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {
    const navigate = useNavigate();
    const auth = getAuth(app)
    const dispatch = useDispatch();
    const handleGoogleClick = async() =>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({prompt:"select_account"})

        try {
            const resultsFromGoogle = await signInWithPopup(auth,provider);
            const res = await fetch('/api/auth/google',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            })
            const data = await res.json();
            if(res.ok){
                dispatch(signInSuccess(data));
                navigate('/');;
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <Button type='button' className='text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' outline  onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6 mr-2' />
      Continue with Google
    </Button>
  )
}

export default OAuth
