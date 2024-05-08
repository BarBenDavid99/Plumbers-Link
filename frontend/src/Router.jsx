import { Route, Routes } from 'react-router-dom';
import AdminLogin from './authorization/AdminLogin';
import Signup from './authorization/AdminSignup';
import Plumbers from './plumbers/Plumbers';
import PlumberSite from './plumbers/PlumberSite';
import EditPlumber from './plumbers/EditPlumber';
import AddPlumber from './plumbers/AddPlumber';
import About from './pages/About';
import Home from './pages/Home';
import AddOpinion from './opinions/AddOpinion';

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/plumbers" element={<Plumbers />} />
            <Route path="/plumberSite/:id" element={<PlumberSite />} />
            <Route path="/plumber/new" element={<AddPlumber />} />
            <Route path="/opinions/new" element={<AddOpinion />} />
            <Route path="/plumber/:id" element={<EditPlumber />} />
            <Route path="/onlyAdmin/login" element={<AdminLogin />} />
            <Route path="/onlyAdmin/signup" element={<Signup />} />
        </Routes>
    );
}
