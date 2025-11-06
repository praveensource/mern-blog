import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon, FaSun} from 'react-icons/fa'
import {useSelector,useDispatch} from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice.js'
import { signoutSuccess } from '../redux/user/userSlice.js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const dispatch = useDispatch();
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const {currentUser} = useSelector((state)=>state.user);
    const {theme} = useSelector((state) => state.theme);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    

    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      if(searchTermFromUrl){
        setSearchTerm(searchTermFromUrl)
      }
    },[location.search])

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
      
      const handleSubmit = (e) =>{
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
      }
  return (
    <Navbar className='border-b-2'>
        {/* logo */}
      <Link to={"/"} className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white '>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Praveen's</span>
        Blog
      </Link>

      {/* for search  */}
      <form onSubmit={handleSubmit}>
        <TextInput  type='text' placeholder='Search...' rightIcon={AiOutlineSearch} className='hidden lg:inline' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
      </form>

      {/* for search small screen */}
      <Button className='w-12 h-10 lg:hidden' pill color={"gray"} >
        <AiOutlineSearch />
      </Button>

      {/* amberger menu */}
      <div className='flex gap-2 md:order-2'>
        <Button className='w-13 h-10 hidden sm:inline' color={"gray"} pill onClick={()=>dispatch(toggleTheme())}>
            {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {/* signin button */}
       
            {currentUser ?(
              <Dropdown arrowIcon={false} inline label={
                <Avatar alt='user' img={currentUser.profilePicture} rounded />

              }>
                <DropdownHeader>
                  <span className='block text-sm'>@{currentUser.username}</span>
                  <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                </DropdownHeader>

                <Link to={'/dashboard?tab=profile'}>

                <DropdownItem>
                  Profile
                </DropdownItem>

                </Link>
                <DropdownDivider />
                <DropdownItem onClick={handleSignout}>
                  Sign out
                </DropdownItem>

              </Dropdown>
            ):
            (
               <Link to={'/sign-in'}>
            <Button className="bg-gradient-to-br from-purple-600 to-blue-500 text-white" outline>
                Sign In
            </Button>
            </Link>
            )}
        
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <NavbarLink active={path==="/"} as={"div"}>
            <Link to={"/"}>Home</Link>
        </NavbarLink>
        <NavbarLink active={path==="/about"} as={"div"}>
            <Link to={"/about"}>About</Link>
        </NavbarLink>
        <NavbarLink active={path==="/projects"} as={"div"}>
            <Link to={"/projects"}>Projects</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  )
}

export default Header
