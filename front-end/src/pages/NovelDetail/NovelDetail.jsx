import { cn } from '../../utils/utils';
import { Button } from '../../components';
import { useState, useEffect, useRef } from 'react';
import { getNovelDetail } from '../../apis/novel';
import { useNavigate, useParams } from 'react-router-dom';

const NovelDetail = ({ ...props }) => {
  const [novelDetail, setNovelDetail] = useState({});
  const { novelId } = useParams();
  const fetching = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    const getNovelInfo = async () => {
      const receiveNovelInfo = await getNovelDetail(novelId);
      if (receiveNovelInfo) {
        setNovelDetail(receiveNovelInfo);
      }
    };
    if (fetching.current == false) {
      fetching.current = true;
      getNovelInfo();
    }

    return () => {
      fetching.current = false;
    };
  }, [novelId]);

  return (
    <div {...props} className={cn('space-y-4 bg-blue-500 p-4', props.className ?? '')}>
      <section className='mx-auto flex max-w-[70%] flex-nowrap space-x-4 rounded-lg bg-red-500 p-4 align-middle'>
        <div
          style={{ backgroundImage: `url(${novelDetail.url})` }}
          className='aspect-card w-[200px] rounded-lg bg-cover bg-no-repeat'
        ></div>
        <div className='flex-grow'>
          <div className='text-3xl font-bold'>{novelDetail.name}</div>
          <div className='opacity-90'>{novelDetail.author}</div>
          <div className='my-4 flex flex-nowrap space-x-2'>
            {novelDetail.categories &&
              novelDetail.categories.map((category) => (
                <div key={category} className='h-fit rounded-full border-[1px] border-black p-2 px-4 text-sm'>
                  {category}
                </div>
              ))}
          </div>
          <div className=''>{novelDetail.description}</div>
        </div>
      </section>
      <section className='mx-auto max-w-[70%] rounded-lg bg-red-500 p-4'>
        {novelDetail.chapters &&
          novelDetail.chapters.map((chapter) => (
            <div key={chapter.id} className='my-1 flex flex-nowrap justify-between rounded-lg bg-green-500 px-4'>
              <div className='font-semimbold self-center'>{chapter.title}</div>
              <Button
                className='self-center'
                onClick={() => {
                  navigate(`/${novelId}/read/${chapter.id}`);
                }}
              >
                Read
              </Button>
            </div>
          ))}
      </section>
    </div>
  );
};

export default NovelDetail;
