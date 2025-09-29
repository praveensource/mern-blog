import { Alert, Button, FloatingLabel, Spinner, TextInput } from "flowbite-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice"
import { useDispatch, useSelector } from "react-redux"

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector((state)=>state.user);
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields!"))
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message))
      }
    
      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/')
      }

    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap--5">
        {/* left */}
        <div className="flex-1">
          {/* logo */}
          <Link to={"/"} className='font-bold dark:text-white text-4xl '>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white '>Praveen's</span>
            Blog
          </Link>
          <p className="text-sm mt-5">You can SignUp or Login by giving your username, email and password or Click on SignUp with Google to continue in this web app.</p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <FloatingLabel type="email" variant="outlined" label="Your Email" id="email" onChange={handleChange} />

            </div>
            <div>
              <FloatingLabel type="password" variant="outlined" label="Your Password" id="password" onChange={handleChange} />

            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500" type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : "Sign In"
              }
            </Button>
          </form>


          <div className="flex gap-2 text-sm mt-5">
            <span>Don't Have an account?</span>
            <Link to={"/sign-up"} className="text-blue-500">
              Sign Up</Link>
          </div>

          {
            errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )
          }

        </div>
      </div>
    </div>
  )
}

export default SignIn
