import { cn } from '../../utils/utils';
import { Link } from 'react-router-dom';

const Header = ({ ...props }) => {
  return (
    <header
      {...props}
      className={cn('fixed left-0 top-0 z-[1000] flex h-14 w-full justify-between bg-slate-200', props.className ?? '')}
    >
      <Link className='mx-4 aspect-square w-10 self-center rounded-full bg-slate-400' to='/home'>
        <div></div>
      </Link>
      <div className='mx-4 aspect-square w-10 self-center rounded-full bg-slate-500'></div>
    </header>
  );
};

export default Header;
