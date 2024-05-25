import { useState, useContext, useRef, useEffect } from 'react';
import { PreferencesContext } from '../../contexts/preferences';
import { Button } from '../../components';
import { convertPreferenceToStyle } from '../../utils/utils';
import { AArrowDown, AArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getChapterContent } from '../../apis/novel';

const NovelReader = () => {
  const [chapterDetail, setChapterDetail] = useState({});
  const [preferences, setPreferences] = useContext(PreferencesContext);
  const fetching = useRef(false);
  const { novelId = '', chapterId = '' } = useParams();

  useEffect(() => {
    const getChapterDetail = async () => {
      const result = await getChapterContent(novelId, chapterId);
      if (result) {
        setChapterDetail(result);
      }
    };
    if (fetching.current === false) {
      fetching.current = true;
      getChapterDetail();
    }

    return () => {
      fetching.current = false;
    };
  }, [novelId, chapterId]);

  const handleFontResize = (increase) => {
    setPreferences((prev) => {
      return {
        ...prev,
        fontSize: prev.fontSize + (increase ? 1 : -1)
      };
    });
  };

  const switchLineSpread = () => {};

  return (
    <div className='relative flex h-screen w-screen flex-col bg-blue-500'>
      <section className='max-w-screen flex justify-between overflow-x-auto overflow-y-hidden p-4'>
        <div className='flex h-fit flex-nowrap space-x-4 align-middle'>
          <Link className='self-center' to={chapterDetail ? `/${chapterDetail.novel_id}/detail` : '/home'}>
            <ChevronLeft />
          </Link>
          {/* info section */}
          <div className='h-fit'>
            <h2 className='text-lg font-bold'>{chapterDetail.novel_name ?? 'Unknown'}</h2>
            <p className='text-sm'>{chapterDetail.author ?? 'unknown'}</p>
          </div>
        </div>
        {/* preferences section */}
        <div className='flex flex-nowrap justify-center'>
          <Button
            onClick={() => {
              handleFontResize(true);
            }}
          >
            <AArrowUp />
          </Button>
          <Button
            onClick={() => {
              handleFontResize(false);
            }}
          >
            <AArrowDown />
          </Button>
        </div>
      </section>
      <section className='h-full flex-grow overflow-y-auto p-4'>
        <pre
          className='font-read-sans h-full w-full overflow-y-auto text-wrap rounded-lg p-4'
          style={convertPreferenceToStyle(preferences)}
        >
          {chapterDetail ? chapterDetail.content : ''}
        </pre>
      </section>
      <section className='absolute bottom-6 left-0 right-0 mx-auto flex w-fit justify-between rounded-full bg-red-500 p-2 px-0'>
        <Link
          to={chapterDetail.previous_chapter ? `/${novelId}/read/${chapterDetail.previous_chapter.id}` : '#'}
          className='roudned-full pl-1 pr-2'
        >
          {chapterDetail.previous_chapter && <ChevronLeft></ChevronLeft>}
        </Link>
        <div className='px-4'>{chapterDetail.chapter_name ?? 'Current Chapter'}</div>
        <Link
          to={chapterDetail.next_chapter ? `/${novelId}/read/${chapterDetail.next_chapter.id}` : '#'}
          className='roudned-full pl-2 pr-1'
        >
          {chapterDetail.next_chapter && <ChevronRight></ChevronRight>}
        </Link>
      </section>
    </div>
  );
};

export default NovelReader;
