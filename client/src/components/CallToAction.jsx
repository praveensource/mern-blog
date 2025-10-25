import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className='flex-1 justify-center flex flex-col object-cover' >
        <h2 className='text-2xl'>Want to see my contributions?</h2>
        <p className='text-gray-500 my-2'>Check these resources with many JavaScript Projects</p>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-bl focus:ring-purple-200 dark:focus:ring-purple-800 rounded-tl-xl rounded-bl-none">
            <a href="https://github.com/praveensource" target='_blank' rel='noopener noreferrer'>Click here</a>

        </Button>
        </div>
        <div className='p-7 flex-1'>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwCV6pkoBzfVUeYqCGwtx7_LHWPu2FXjEGOA&s" alt="logo" />
        </div>
      
    </div>
  )
}

export default CallToAction
