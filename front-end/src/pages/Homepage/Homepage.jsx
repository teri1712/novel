import {cn} from '../../utils/utils'
const novels = [
  {
    name: 'ABC',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    name: '1234',
    url: 'https://picsum.photos/800',
    author: 'Quang',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    name: 'others others',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    name: 'ABCD',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    name: '12345',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    name: 'others',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    name: 'others2',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    name: 'others3',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
];


const Homepage = ({...props}) => {

  return (
    <div {...props} className={cn("bg-green-500 h-lvh", props.className ?? '')} >
      <Header></Header>
        <section className='bg-purple-500 pt-20 min-h-full pb-12 px-4'>
          <div className='mx-auto w-full pb-10'>
            <SearchBar className='mx-auto w-full' placeholder="Search for a novel" />
          </div>
      <div className='flex flex-col-reverse lg:grid lg:grid-cols-[1fr_auto]'>
        <div className=''>
          <div className='flex flex-wrap px-4'>
            {
              novels.map((novel) => {
                return (<NovelCard key={novel.name} name={novel.name} author={novel.author} url={novel.url} categories={novel.categories}/>);
              })
            }
          </div>
        </div>
        <RecentItems />
      </div>
        </section>
    </div>
  );
};

const Header = ({...props}) => {
  return (
    <header {...props} className={cn("bg-red-500 z-[1000] fixed top-0 left-0 w-full h-14 flex justify-between", props.className ?? '')} >
      <div className='rounded-full bg-cyan-500 aspect-square w-12 mx-1 self-center'></div>
      <div className='rounded-full bg-cyan-500 aspect-square w-12 mx-4 self-center'></div>
    </header>
  );
};

const SearchBar = ({...props}) => {
  return (
    <input {...props} className={cn('p-1 rounded-lg', props.className ?? '')}></input>
  );
};

const NovelCard = ({...props}) => {
  return (
    <div className={cn("bg-blue-500 w-[140px] md:w-[200px] h-fit m-2 aspect-card relative rounded-lg", ...props.className ?? '')} >
      <div style={{backgroundImage: `url(${props.url})`}} className={cn(props.url ? 'rounded-lg h-full bg-cover bg-center' : 'opacity-0')}></div>
      <div className='w-full h-20 p-4 absolute bottom-0 left-0 bg-slate-200 rounded-b-lg '>
        <div className='text-lg font-semibold'>{props.name}</div>
        <div className='text-sm opacity-80'>{props.author}</div>
      </div>
    </div>
  );
};

const RecentItems = ({...props}) => {
  const recentItems = [
    {
      name: 'First recent novel',
      author: 'Quang',
      chapter: '4 - Something',
    },
    {
      name: 'Second recent novel',
      author: 'Quang',
      chapter: '4 - Something',
    },
    {
      name: 'Third recent novel',
      author: 'Quang',
      chapter: '4 - Something',
    }
  ];
  return (
    <div {...props} className={cn('w-full rounded-lg max-h-[500px] border-[1px] p-4', props.className ?? '')}>
      <h1 className='text-lg font-bold'>Recently Read</h1>
      {
        recentItems && recentItems.map((item) => {
          return (<RecentItem key={item.name} name={item.name} author={item.author} chapter={item.chapter}></RecentItem>);
        })
      }
    </div>
  );
};

const RecentItem = ({...props}) => {
  return (
    <div className='p-4 my-2 rounded-lg bg-yellow-500 flex justify-between'>
      <div>
        <p className='font-semibold'>{props.name}</p>
        <p className='text-sm'>{props.author}</p>
      </div>
      <div className='flex space-x-4'>
        <div className='border-[1px] text-[0.75rem] mx-4 rounded-full h-fit border-black overflow-hidden self-center text-ellipsis text-nowrap px-4 p-2'>{props.chapter}</div>
        <Button className={'rounded-full aspect-square'}>{'>'}</Button>
      </div>
    </div>
  );
};

const Button = ({children, ...props}) => {
  return (
    <button {...props}>{children}</button>
  );
};


export default Homepage;