import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import { delay } from '../utils/utils';

const NOVEL_SERVICE_URL = 'http://localhost:3000/api/v1';
const novels = [
  {
    id: '1',
    name: 'ABC',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    id: '2',
    name: '1234',
    url: 'https://picsum.photos/800',
    author: 'Quang',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    id: '3',
    name: 'others others',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    id: '4',
    name: 'ABCD',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    id: '5',
    name: '12345',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    id: '6',
    name: 'others',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    id: '7',
    name: 'others2',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  },
  {
    id: '8',
    name: 'others3',
    author: 'Quang',
    url: 'https://picsum.photos/800',
    categories: ['I', 'am', 'not', 'sure']
  }
];

const novelDetail = {
  name: 'One of the novel name',
  author: 'The ultimate author',
  url: 'https://picsum.photos/800',
  categories: ['novel', 'creepy', 'thriller', 'crime'],
  description:
    'A man fell into a deep dark hole indefinitely and see every different world below the groud for 2 second each.',
  chapters: [
    {
      id: '1',
      title: 'The first chapter'
    },
    {
      id: '2',
      title: 'The second chapter'
    },
    {
      id: '3',
      title: 'The third chapter'
    },
    {
      id: '4',
      title: 'The forth chapter'
    },
    {
      id: '5',
      title: 'The fifth chapter'
    },
    {
      id: '6',
      title: 'The sixth chapter'
    },
    {
      id: '7',
      title: 'The seventh chapter'
    },
    {
      id: '8',
      title: 'The eighth chapter'
    }
  ]
};

const recentItems = [
  {
    id: '1',
    name: 'First recent novel',
    author: 'Quang',
    chapter: {
      id: '1',
      name: 'Chapter 1'
    }
  },
  {
    id: '2',
    name: 'Second recent novel',
    author: 'Quang',
    chapter: {
      id: '3',
      name: 'Chapter 3: Something'
    }
  },
  {
    id: '3',
    name: 'Third recent novel',
    author: 'Quang',
    chapter: {
      id: '4',
      name: 'Chapter 4'
    }
  }
];

const chapterContent = {
  novel_id: '1',
  chapter_id: '1',
  author: 'Duy Quang',
  novel_name: 'Lolita',
  chapter_name: 'Part 1',
  chapter_index: 1,
  total_chapter: 10,
  previous_chapter: null,
  next_chapter: {
    id: '2',
    name: 'Part 2'
  },
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur lorem nulla, ullamcorper sed tristique eu, blandit in felis. Proin in malesuada erat, et blandit sem. Donec et augue nibh. Pellentesque semper velit nec tempor dictum. Suspendisse tortor est, commodo at ex quis, blandit imperdiet lacus. Aliquam id volutpat massa. Fusce luctus aliquam tortor, non pretium metus eleifend a. Morbi euismod porttitor bibendum. Morbi arcu velit, lobortis quis purus tristique, lobortis convallis lorem.\n\n  Aliquam vel varius nisl. Vestibulum vehicula id massa et convallis. Pellentesque venenatis vestibulum purus, at pretium nisi vehicula sit amet. Morbi quis aliquam ante. Mauris ut augue elit. Maecenas pellentesque ultrices congue. In hac habitasse platea dictumst. Nulla facilisi. Ut placerat ante nec eleifend blandit.\n\n Maecenas eget vulputate quam. Morbi lectus ipsum, accumsan ac euismod iaculis, laoreet sed justo. Aliquam egestas lacus varius, dignissim nibh vitae, dapibus odio. Duis quis gravida libero, quis pulvinar elit. Quisque eleifend ornare dolor, eget pharetra purus dapibus a. Cras placerat tellus blandit scelerisque aliquet. Nullam viverra, nulla ac interdum placerat, elit erat congue neque, sit amet iaculis tortor ex a justo. Vivamus varius, velit sit amet rutrum maximus, nulla nulla aliquet quam, vulputate sagittis quam metus id nisl. Ut nec aliquam mi. Aliquam rhoncus nisl libero, eu aliquet metus mollis sit amet. Ut et porttitor sem.'
};

export const handlers = [
  http.get(`${NOVEL_SERVICE_URL}/novels`, ({}) => {
    delay(200);
    return HttpResponse.json(novels, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/1/detail`, ({}) => {
    delay(200);
    return HttpResponse.json(novelDetail, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/recent`, ({}) => {
    delay(200);
    return HttpResponse.json(recentItems, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/detail/1/1`, ({}) => {
    delay(200);
    return HttpResponse.json(chapterContent, {
      status: 200
    });
  })
];

export const server = setupWorker(...handlers);
