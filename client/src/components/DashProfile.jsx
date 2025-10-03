import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import axios from 'axios'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const DashProfile = () => {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
     const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
    const [formData, setFormData] = useState({})
    const filePickerRef = useRef();

    const handleImageChange = (e) =>{
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
    useEffect(()=>{
      if(imageFile){
        uploadImage();
      }
    }, [imageFile]);

    const uploadImage = async()=>{
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

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      
      <form className='flex flex-col gap-4'>
        
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />

        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>filePickerRef.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} strokeWidth={5} styles={{
              root:{
                width:'100%',
                height:'100%',
                position:'absolute',top:0,left:0,
              },
              path:{
                stroke:`rgba(62,152,99,${imageFileUploadProgress / 100})`
              }
            }} />
          )}
            <img src={imageFileUrl || currentUser.profilePicture} alt="user_profile_photo" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />
        </div>


        
          {imageFileUploadError && (
            <Alert color='failure'>{imageFileUploadError}</Alert>
          )}
        

        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
        <TextInput type='email' id='email' placeholder='username' defaultValue={currentUser.email} />
        <TextInput type='password' id='password' placeholder="password" />

        <Button type='submit' className='bg-gradient-to-br from-purple-600 to-blue-500 p-4 text-white' outline>
            Update
        </Button>

      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default DashProfile
