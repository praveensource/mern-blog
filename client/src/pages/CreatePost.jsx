import {Button, FileInput, Select, TextInput} from 'flowbite-react';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";



const CreatePost = () => {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
        
        <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1' />

                <Select>
                    <option value={"uncategorized"}>Select a category</option>
                    <option value={"javascript"}>JavaScript</option>
                    <option value={"react"}>react.js</option>
                    <option value={"node"}>node.js</option>
                </Select>
            </div>

            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <FileInput type='file' accept='image/*' />
                <Button type='button' className="bg-gradient-to-br from-purple-600 to-blue-500 text-white" size='sm' outline>Upload image</Button>
            </div>
           <Editor
  
  toolbarClassName="toolbarClassName"
  wrapperClassName="wrapperClassName"
  editorClassName="editorClassName min-h-[200px] p-2 focus:outline-none dark:bg-white dark:text-black font-size:1.05erm"
  
/>;
<Button type='submit' className='bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-2 px-4 rounded'>
    Publish
</Button>
        </form>
    </div>
  )
}

export default CreatePost
