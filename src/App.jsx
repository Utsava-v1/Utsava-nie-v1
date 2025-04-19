import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Feedback from './pages/Feedback';
import TnC from './pages/TnC';
import Developers from './pages/Developers';
import Student from './pages/Student';
import Organizer from './pages/Organizer';
import NotFound from './pages/NotFound';
import CreateEvent from './pages/CreateEvent';
import Layout from './Layout';
import OrganizerDashboard from './pages/OrganizerDashboard';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// added lines
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from './firebase';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path='/about' element={<About />} />
            <Route path='/feedback' element={<Feedback />} />
            <Route path='/terms' element={<TnC />} />
            <Route path='/developers' element={<Developers />} />
            <Route path='/login' element={<Login />} />
            <Route path='/student-signup' element={<SignUp />} />
            <Route path='/student' element={
              <PrivateRoute>
                <Student />
              </PrivateRoute>
            } />
            <Route path='/organizer-signup' element={
              // <PrivateRoute>
                <Organizer />
              // </PrivateRoute>
            } />
            <Route path={'/:organizerName/create-event'} element={
              <PrivateRoute>
                <CreateEvent />
              </PrivateRoute>
            } />
            <Route path={'/:organizerName/dashboard'} element={
              <PrivateRoute>
                <OrganizerDashboard />
              </PrivateRoute>
            } />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
