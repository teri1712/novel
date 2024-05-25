import {cn} from '../../utils/utils';

const SearchBar = ({...props}) => {
  return (
    <input {...props} className={cn('p-1 rounded-lg', props.className ?? '')}></input>
  );
};

export default SearchBar;