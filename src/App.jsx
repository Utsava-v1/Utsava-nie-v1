import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Feedback from './pages/Feedback';
import TnC from './pages/TnC';
import Developers from './pages/Developers';
import StudentProfile from './pages/StudentProfile';
import SignupOrg from './pages/SignupOrg';
import NotFound from './pages/NotFound';
import CreateEvent from './pages/CreateEvent';
import Layout from './Layout';
import OrganizerDashboard from './pages/OrganizerDashboard';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RegisterEvent from './pages/RegisterEvent';
import EditEvent from './pages/EditEvent';
import ManageEvent from './pages/ManageEvent';
import EditRegistration from './pages/EditRegistration';
import EventFeedback from './pages/EventFeedback';
import CompleteProfile from './pages/CompleteProfile';

function AppContent() {
  const { userProfile } = useAuth();


  // if (loading) {
  //   return <div>Loading...</div>;  // show spinner or loading screen
  // }

  console.log(userProfile);
  const currentUserUSN = userProfile?.usn || null;
  const currentUserEmail = userProfile?.email || null;
  const role = userProfile?.role || null;



  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={
            <PrivateRoute currentUserUSN={currentUserUSN} currentUserEmail={currentUserEmail} role={role}>
              <Home />
            </PrivateRoute>
          } />
          <Route path='/about' element={<About />} />
          <Route path='/feedback' element={
            <PrivateRoute currentUserUSN={currentUserUSN} currentUserEmail={currentUserEmail} role={role}>
              <Feedback currentUserUSN={currentUserUSN} currentUserEmail={currentUserEmail} role={role} eventId={'platform'} />
            </PrivateRoute>
          } />
          <Route path='/terms' element={<TnC />} />
          <Route path='/developers' element={<Developers />} />
          <Route path='/login' element={<Login />} />
          <Route path='/student-signup' element={<SignUp />} />
          <Route path='/:student/profile' element={
            <PrivateRoute currentUserUSN={currentUserUSN} currentUserEmail={currentUserEmail} role={role}>
              <StudentProfile />
            </PrivateRoute>
          } />
          <Route path='/:event_id/register' element={
            <PrivateRoute currentUserUSN={currentUserUSN} currentUserEmail={currentUserEmail} role={role}>
              <RegisterEvent />
            </PrivateRoute>
          } />

          <Route path='/organizer-signup' element={<SignupOrg />} />
          <Route path='/:organizerName/create-event' element={
            <PrivateRoute currentUserUSN={currentUserUSN} currentUserEmail={currentUserEmail} role={role}>
              <CreateEvent />
            </PrivateRoute>
          } />
          <Route path='/edit-event/:eventId' element={
            <PrivateRoute currentUserUSN={currentUserUSN} currentUserEmail={currentUserEmail} role={role}>
              <EditEvent />
            </PrivateRoute>
          } />
          <Route path='/manage-event/:eventId' element={
            <PrivateRoute currentUserUSN={currentUserUSN} currentUserEmail={currentUserEmail} role={role}>
              <ManageEvent />
            </PrivateRoute>
          } />
          <Route path='/:organizerName/dashboard' element={
            <PrivateRoute currentUserUSN={currentUserUSN} currentUserEmail={currentUserEmail} role={role}>
              <OrganizerDashboard />
            </PrivateRoute>
          } />
          <Route path='/:organizerName' element={<Navigate to="/" />} />
          <Route path='/edit-registration/:registrationId' element={
            <PrivateRoute>
              <EditRegistration />
            </PrivateRoute>
          } />
          <Route path='/event-feedback/:eventId' element={
            <PrivateRoute currentUserUSN={currentUserUSN} currentUserEmail={currentUserEmail} role={role}>
              <EventFeedback />
            </PrivateRoute>
          } />

          <Route
            path="/:event-id/register"
            element={
              <PrivateRoute role="student">
                <RegisterEvent />
              </PrivateRoute>
            }
          />

          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Router >
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
