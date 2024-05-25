import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';

const CheckList = lazy(() => import('./pages/CheckList/CheckList'));
const Homepage = lazy(() => import('./pages/Homepage/Homepage'));
const NovelDetail = lazy(() => import('./pages/NovelDetail/NovelDetail'));
const NovelReader = lazy(() => import('./pages/NovelReader/NovelReader'));
const ConfigLayout = lazy(() => import('./pages//ConfigLayout/ConfigLayout'));

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
          <Route element={<ConfigLayout></ConfigLayout>}>
            <Route path='/' element={<Navigate to='/todos' replace />}></Route>
            <Route path='/home' element={<Homepage />}></Route>
            <Route path='/:novelId/detail' element={<NovelDetail />}></Route>
            <Route path='/todos' element={<CheckList />}></Route>
          </Route>
          <Route path='/:novelId/read/:chapterId' element={<NovelReader />}></Route>
        </Routes>
      </Suspense>
    </>
  );
}
export default App;
