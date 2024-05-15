import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
const CheckList = lazy(() => import('./pages/CheckList/CheckList'));

function App() {
  return (
    <>
    <Suspense
        fallback={
          <div className='h-screen'>
            <p className='place-content-center'>Unimplemented</p>
          </div>
        }
      >
        <Routes>
          <Route path='/' element={<Navigate to='/home' replace />}></Route>
          <Route path='/home'  element={<CheckList />}></Route>
        </Routes>
      </Suspense>
    </>
  );
}
export default App
