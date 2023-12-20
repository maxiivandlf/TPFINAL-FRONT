import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Map from './pages/Map/Map';
import Events from './pages/events/events';
import Page404 from './pages/404/404';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/mapa' element={<Map />} />
        <Route path='/eventos' element={<Events />}>
          <Route path='details/:eventId' element={<Events />} />
        </Route>
        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;
