import React from 'react';
import { useGetSocialPostsQuery } from '@/features/api/apiSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { useAppSelector } from '@/hooks';
import { SerializedError } from '@reduxjs/toolkit';
import Image from 'next/image';

function isFetchBaseQueryError(e: unknown): e is FetchBaseQueryError {
  return typeof e === 'object' && e != null && 'status' in e;
}

function isSerializedError(e: unknown): e is SerializedError {
  return typeof e === 'object' && e != null && 'message' in e;
}

interface SocialPost {
  id: string;
  user: string;
  profilePic: string;
  text: string;
  imageUrl: string | null;
  timestamp: string;
  likes: number;
  comments: number;
}

const SocialFeed = () => {
  const searchTerm = useAppSelector(state => state.preferences.searchTerm);
  const { data, isLoading, isSuccess, isError, error } = useGetSocialPostsQuery({ searchTerm: searchTerm });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-300">Loading social posts...</p>
      </div>
    );
  }

  if (isError) {
    console.error("Social Posts Error:", error);
    let msg: string;
    if (isFetchBaseQueryError(error)) {
      msg = (error.data as { message?: string })?.message || `Status ${error.status}`;
    } else if (isSerializedError(error)) {
      msg = error.message || 'An unknown serialization error occurred.';
    } else {
      msg = 'An unexpected error occurred.';
    }
    return (
      <div className="text-center p-8 text-red-600 dark:text-red-400">
        <p className="text-xl font-semibold mb-2">Failed to load social posts.</p>
        <p className="text-sm">Please check your mock data file or try again later. (Error: {msg})</p>
      </div>
    );
  }

  if (isSuccess && data?.posts) {
    const posts = data.posts;
    // Client-side filtering for mock social posts
    const filteredPosts = posts.filter((post: SocialPost) =>
      post.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredPosts.length === 0) {
      return (
        <div className="text-center p-8 text-gray-600 dark:text-gray-300">
          <p className="text-xl font-semibold mb-2">No social posts found for &quot;{searchTerm}&quot;.</p>
          <p className="text-sm">Try a different search term.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((p: SocialPost) => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center mb-3">
              <Image src={p.profilePic} alt={`${p.user}'s profile`} width={50} height={50} className="w-10 h-10 rounded-full mr-3" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{p.user}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(p.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{p.text}</p>
            {p.imageUrl && (
              <Image src={p.imageUrl} alt="Social post content" width={400} height={200} className="w-full h-auto rounded-md mb-3" />
            )}
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>Likes: {p.likes}</span>
              <span>Comments: {p.comments}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default SocialFeed;
