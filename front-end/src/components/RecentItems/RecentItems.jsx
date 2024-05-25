import { cn } from '../../utils/utils';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getRecentNovels } from '../../apis/novel';

const RecentItems = ({ ...props }) => {
  const [recentItems, setRecentItems] = useState([]);
  const fetching = useRef(false);
  useEffect(() => {
    const getRecentNovelItems = async () => {
      const receiveNovelItems = await getRecentNovels();
      if (receiveNovelItems) {
        setRecentItems(receiveNovelItems);
      }
    };
    if (fetching.current == false) {
      fetching.current = true;
      getRecentNovelItems();
    }

    return () => {
      fetching.current = false;
    };
  }, []);

  return (
    <div {...props} className={cn('max-h-[500px] w-full rounded-lg border-[1px] p-4', props.className ?? '')}>
      <h1 className='text-lg font-bold'>Recently Read</h1>
      {recentItems &&
        recentItems.map((item) => {
          return (
            <div key={item.novel_id}>
              <RecentItem item={item}></RecentItem>
            </div>
          );
        })}
    </div>
  );
};

const RecentItem = ({ ...props }) => {
  const item = props.item;
  return (
    <div {...props} className={cn('my-2 flex justify-between rounded-lg bg-yellow-500 p-4', props.className ?? '')}>
      <div>
        <p className='font-semibold'>{item.name}</p>
        <p className='text-sm'>{item.author}</p>
      </div>
      <div className='flex space-x-4'>
        <Link
          to={`/${item.id}/read/${item.chapter.id}`}
          className='mx-4 flex h-fit w-32 flex-nowrap justify-center self-center rounded-full border-[1px] border-black p-2 px-4 align-middle text-[0.75rem]'
        >
          <p className='overflow-hidden text-ellipsis text-nowrap'>{item.chapter.name}</p>
          <div className='ml-auto w-[1rem]'>
            <ChevronRight size='1rem' className='ml-2 self-center' />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RecentItems;
