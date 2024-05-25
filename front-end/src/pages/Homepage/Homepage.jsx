import { cn } from '../../utils/utils';
import { NovelCard, SearchBar, RecentItems } from '../../components';
import { useState, useEffect, useRef } from 'react';
import { getNovels } from '../../apis/novel';

const Homepage = ({ ...props }) => {
  const [novelList, setNovelList] = useState([]);
  const fetching = useRef(false);
  useEffect(() => {
    const getNovelList = async () => {
      const receiveNovelList = await getNovels();
      if (receiveNovelList) {
        setNovelList(receiveNovelList);
      }
    };
    if (fetching.current == false) {
      fetching.current = true;
      getNovelList();
    }

    return () => {
      fetching.current = false;
    };
  }, []);

  return (
    <div {...props} className={cn('h-full bg-green-500', props.className ?? '')}>
      <section className='min-h-full bg-purple-500 px-4 pb-12 pt-4'>
        <div className='mx-auto my-2 w-full pb-10'>
          <SearchBar className='mx-auto w-full' placeholder='Search for a novel' />
        </div>
        <div className='flex flex-col-reverse lg:grid lg:grid-cols-[1fr_auto]'>
          <div className=''>
            <div className='flex flex-wrap'>
              {novelList &&
                novelList.map((novel) => (
                  <NovelCard
                    key={novel.id}
                    id={novel.id}
                    name={novel.name}
                    author={novel.author}
                    url={novel.url}
                    categories={novel.categories}
                  />
                ))}
            </div>
          </div>
          <RecentItems className='w-full' />
        </div>
      </section>
    </div>
  );
};

export default Homepage;
