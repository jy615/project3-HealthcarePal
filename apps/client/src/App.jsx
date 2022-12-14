import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import CoverPage from './pages/CoverPage'
import Footer from './pages/Footer'

import CreateProfile from './pages/users/CreateProfile'
import Home from './pages/users/Home'
import Signin from './pages/users/Signin'
import Signup from './pages/users/Signup'
import Signout from './pages/users/Signout'

import AdminHome from './pages/admin/Home'
import UserAppointment from './pages/admin/UserAppointment'
import UserApptUpdate from './pages/admin/UserApptUpdate'
import UserProfileUpdate from './pages/admin/UserProfileUpdate'

function App() {

  return (
    <div className="App d-flex flex-column justify-content-between" style={{minHeight: "100vh"}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/*" element={ <Navigate to="/" /> } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signout" element={<Signout />} />
          <Route path="/createProfile" element={<CreateProfile />} />
          <Route path="/home" element={<Home page="userProfile" />} />
          <Route path="/healthProfile" element={<Home page="healthProfile" />} />
          <Route path="/bookAppointment" element={<Home page="bookAppointment" />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/userAppointment/:apptId" element={<UserAppointment />} />
          <Route path="/admin/userApptUpdate/:apptId" element={<UserApptUpdate />} />
          <Route path="/admin/userProfileUpdate/:userProfileId" element={<UserProfileUpdate />} />
          
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  )
}

export default App
