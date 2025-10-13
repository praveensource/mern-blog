import { Alert, Button, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateSuccess, updateStart, deleteUserFailure,deleteUserStart,deleteUserSuccess, signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {Link} from 'react-router-dom'

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  
  
  const filePickerRef = useRef();
  // user profile form update functionality
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSucess, setUpdateUserSucess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  // deleting user functionality
  const [showModal, setShowModal] = useState(false);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024 || !["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        setImageFileUploadError
          ("Could not upload image (File must be less than allowed size)")
      }

      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploadError(null)
    try {
      const formDataCloud = new FormData();
      formDataCloud.append("file", imageFile);
      formDataCloud.append("upload_preset", "react_profile_upload");
      formDataCloud.append("folder", "users/profiles");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dujkaa9bu/image/upload",
        formDataCloud,
        {
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setImageFileUploadProgress(progress.toFixed(0));
          },
        }
      );

      const downloadURL = res.data.secure_url;
      setImageFileUrl(downloadURL);
      setFormData((formData) => ({ ...formData, profilePicture: downloadURL }));
      setImageFileUploading(false);
      setImageFileUploadProgress(null);

    } catch (error) {
      console.error(error);
      setImageFileUploadError("Could not upload image (File must be less than allowed size)");
      setImageFileUploading(false);
      setImageFileUploadProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
    }
  }


  // update functionaity
  const handleChange = (e) =>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(Object.keys(formData).length === 0){
      return;
    }
    if(imageFileUploading){
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:"PUT",
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(!res.ok){
        dispatch(updateFailure(data.message));
      }else{
        dispatch(updateSuccess(data));
        setUpdateUserSucess("User updated successfully")
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  }

  // delete user functionality
  const handleDeleteUser = async() =>{
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(deleteUserFailure(data.message));
      }else{
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      
    }
  }
  // sign out 
  const handleSignout = async() =>{
    try {
      const res = await fetch('/api/user/signout',{
        method:"POST",
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message

        )
      }else{
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />

        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} strokeWidth={5} styles={{
              root: {
                width: '100%',
                height: '100%',
                position: 'absolute', top: 0, left: 0,
              },
              path: {
                stroke: `rgba(62,152,99,${imageFileUploadProgress / 100})`
              }
            }} />
          )}
          <img src={imageFileUrl || currentUser.profilePicture} alt="user_profile_photo" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />
        </div>



        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}


        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type='email' id='email' placeholder='username' defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type='password' id='password' placeholder="password" onChange={handleChange} />

        <Button type='submit' className='bg-gradient-to-br from-purple-600 to-blue-500 p-4 text-white' outline disabled={loading || imageFileUploading}>
          {loading?"Loading.." : "update"}
        </Button>
        {
          currentUser.isAdmin && (

           <Link to={'/create-post'}>
             <Button type='button' className='bg-gradient-to-br from-purple-600 to-blue-500 text-white w-full' outline >
              Create a post
            </Button>
           </Link>
          )
        }

      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={handleSignout}>Sign Out</span>
      </div>
      {updateUserSucess && (
        <Alert color='success' className='mt-5'>
        {updateUserSucess}
      </Alert>
      )}
      {updateUserError && (
        <Alert color='success' className='mt-5'>
        {updateUserError}
      </Alert>
      )}
      {error && (
        <Alert color='success' className='mt-5'>
        {error}
      </Alert>
      )}
      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure your want to delete this account?</h3>

            {/* yes and no */}
            <div className='flex justify-center gap-4'>
              <Button className='bg-red-500' outline onClick={handleDeleteUser}>Yes i'm sure</Button>

              <Button color={'gray'} onClick={()=>setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default DashProfile
