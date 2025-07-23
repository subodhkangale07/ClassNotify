import ShowAllTimeTables from './pages/ShowAllTimeTables'
import UpdateCombinedTimetable from './pages/UpdateCombinedTimetable';
import CombinedTimeTable from './pages/CombinedTimeTable';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Class  from './components/Class';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useNavigate  } from 'react-router-dom';
import  Subject  from "./components/Subject";
import User  from './components/User';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserPanel from './pages/UserPanel';  




function App(){

  const navigate = useNavigate();

  return (

    <Routes>

      <Route path="/" element={<Home/>} />
      <Route path='/showAllTimeTables' element={<ShowAllTimeTables/>}></Route>
       <Route path='/updateTimeTable/:id' element={<UpdateCombinedTimetable/>}></Route>

        <Route path='/user-dashboard' element={<UserPanel/>}></Route>

        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>


        <Route path='/createTimeTable' element = { <CombinedTimeTable/> } > </Route>
        <Route path='/add-class' element = { <Class> </Class> } > </Route>
       <Route path = '/add-subject' element = { <Subject> </Subject> } >    </Route>
       <Route path = '/add-user' element = { <User> </User> } >    </Route>


        <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><div>Admin Dashboard</div></ProtectedRoute>} />
        <Route path="/user-dashboard" element={<ProtectedRoute requiredRole="user"><div>Faculty Dashboard</div></ProtectedRoute>} />




    </Routes>
  )
}


export default App


