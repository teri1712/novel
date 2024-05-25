import { cn } from '../../utils/utils';
import { Input } from '../../components';
import { Search } from 'lucide-react';

const SearchBar = ({ ...props }) => {
  return (
    <div className='relative'>
      <Input {...props} className={cn('rounded-lg pl-8', props.className ?? '')}></Input>
      <Search size={'1rem'} className='absolute left-2 top-1/2 -translate-y-1/2'></Search>
    </div>
  );
};

export default SearchBar;
