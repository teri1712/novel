import { cn } from '../../utils/utils';
import { Link } from 'react-router-dom';

const Header = ({ ...props }) => {
  return (
    <header
      {...props}
      className={cn('fixed left-0 top-0 z-[1000] flex h-14 w-full justify-between bg-red-500', props.className ?? '')}
    >
      <Link className='mx-1 aspect-square w-12 self-center rounded-full bg-cyan-500' to='/home'>
        <div></div>
      </Link>
      <div className='mx-4 aspect-square w-12 self-center rounded-full bg-cyan-500'></div>
    </header>
  );
};

export default Header;
