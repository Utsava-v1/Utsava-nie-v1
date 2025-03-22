import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Feedback from './pages/Feedback';
import TnC from './pages/TnC';
import Developers from './pages/Developers';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

import Layout from './Layout';
import OrganizerDashboard from './pages/OrganizerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/terms' element={<TnC />} />
          <Route path='/developers' element={<Developers/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path={'/:organizerName/dashboard'} element={<OrganizerDashboard/>} />
          <Route path='*' element={<NotFound />} />
        </Route>

      </Routes>

    </Router>
  );
}

export default App;
