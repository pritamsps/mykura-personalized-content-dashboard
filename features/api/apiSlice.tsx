import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react';

const NEWS_API_BASE_URL = 'https://newsapi.org/v2/';
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

const newsApiBaseQuery = fetchBaseQuery({ baseUrl: NEWS_API_BASE_URL });

const mockSocialBaseQuery: BaseQueryFn<string, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta> = async (
    args,
    api,
    extraOptions
  ) => {
    try {
      const url = `/${args}`;
      const response = await fetch(url);
      const data = await response.json();
      return { data };
    } catch (rawError: any) {
      const errorMessage = rawError instanceof Error ? rawError.message : 'An unknown social mock fetch error occurred';
      return { 
        error: { 
          status: 'CUSTOM_ERROR' as const,
          data: errorMessage,
          error: errorMessage,
        } as FetchBaseQueryError 
      };
    }
  };


const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta> = async (
  args,
  api,
  extraOptions
) => {
  // Handle social posts mock data
  if (typeof args === 'string' && args.includes('mock_data/social_posts.json')) {
    return mockSocialBaseQuery(args, api, extraOptions);
  }
  // Handle News API queries (when args is an object with url property)
  if (typeof args === 'object' && args !== null && 'url' in args) {
    return newsApiBaseQuery(args, api, extraOptions);
  }
  // This should not happen, but return an error if it does
  return { 
    error: { 
      status: 'CUSTOM_ERROR' as const,
      data: 'Invalid query',
      error: 'Invalid query',
    } as FetchBaseQueryError 
  };
};


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getNews: builder.query({
      query: (params: { category?: string; searchTerm?: string } = {}) => {
        if (!NEWS_API_KEY) {
          throw new Error('News API key is not configured. Please add NEXT_PUBLIC_NEWS_API_KEY to your .env.local file. Get a free key from https://newsapi.org');
        }
        const { category, searchTerm } = params;
        const queryCategory = category || 'general';
        const searchQuery = searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : '';
        return {
          url: `top-headlines?category=${queryCategory}${searchQuery}&apiKey=${NEWS_API_KEY}`,
        };
      },
    }),
    getSocialPosts: builder.query({
        query: (params: { searchTerm?: string } = {}) => {
            const { searchTerm } = params;
            return 'mock_data/social_posts.json';
        },
    }),
  }),
});

export const { useGetNewsQuery, useGetSocialPostsQuery } = apiSlice;
