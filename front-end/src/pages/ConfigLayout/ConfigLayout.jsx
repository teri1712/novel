import { Outlet } from 'react-router-dom';
import { Header } from '../../components';

const ConfigLayout = () => {
  return (
    <>
      <Header></Header>
      <div className='min-h-full pt-14'>
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default ConfigLayout;
