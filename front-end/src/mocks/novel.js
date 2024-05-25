import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

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

export const handlers = [
  http.get(`${NOVEL_SERVICE_URL}/novels`, ({}) => {
    return HttpResponse.json(novels, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/1/detail`, ({}) => {
    return HttpResponse.json(novelDetail, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/recent`, ({}) => {
    return HttpResponse.json(recentItems, {
      status: 200
    });
  })
];

export const server = setupWorker(...handlers);
