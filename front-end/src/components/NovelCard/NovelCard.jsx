import { cn } from '../../utils/utils';
import { Link } from 'react-router-dom';

const NovelCard = ({ ...props }) => {
  return (
    <Link
      to={`/${props.id}/detail`}
      className={cn(
        'relative my-2 mr-4 aspect-card h-fit w-[140px] rounded-lg bg-blue-500 md:w-[200px]',
        ...(props.className ?? '')
      )}
    >
      <div
        style={{ backgroundImage: `url(${props.url})` }}
        className={cn(props.url ? 'h-full rounded-lg bg-cover bg-center' : 'opacity-0')}
      ></div>
      <div className='absolute bottom-0 left-0 h-20 w-full rounded-b-lg bg-slate-200 p-4 '>
        <div className='text-lg font-semibold'>{props.name}</div>
        <div className='text-sm opacity-80'>{props.author}</div>
      </div>
    </Link>
  );
};

export default NovelCard;
