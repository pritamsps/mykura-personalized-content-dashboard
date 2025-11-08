import React from 'react';
import { useAppSelector } from '@/hooks';
import { useGetNewsQuery } from '@/features/api/apiSlice';
import ContentCard from './ContentCard';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
}

function isSerializedError(error: unknown): error is SerializedError {
    return typeof error === 'object' && error != null && 'message' in error;
}

interface NewsArticle {
    source: { id: string | null; name: string; };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}

const NewsFeed = () => {
    const selectedCategories = useAppSelector(state => state.preferences.categories);
    const searchTerm = useAppSelector(state => state.preferences.searchTerm);

    const categoryToFetch = selectedCategories.length > 0 ? selectedCategories[0] : 'general';
    const { data, isLoading, isSuccess, isError, error } = useGetNewsQuery({
        category: categoryToFetch,
        searchTerm: searchTerm
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-600 dark:text-gray-300">Loading news...</p>
            </div>
        );
    }

    if (isError) {
        console.error("News API Error:", error);
        let errorMessage: string;
        if (isFetchBaseQueryError(error)) {
            errorMessage = (error.data as { message?: string })?.message || `Status ${error.status}`;
        } else if (isSerializedError(error)) {
            errorMessage = error.message || 'An unknown serialization error occurred.';
        } else {
            errorMessage = 'An unexpected error occurred.';
        }
        return (
            <div className="text-center p-8 text-red-600 dark:text-red-400">
                <p className="text-xl font-semibold mb-2">Failed to load news.</p>
                <p className="text-sm">Please check your API key or try again later. (Error: {errorMessage})</p>
            </div>
        );
    }

    if (isSuccess && data?.articles) {
        const articlesToDisplay = data.articles.filter(
            (article: NewsArticle) => article.title && article.description
        );

        if (articlesToDisplay.length === 0) {
            return (
                <div className="text-center p-8 text-gray-600 dark:text-gray-300">
                    <p className="text-xl font-semibold mb-2">No news found.</p>
                    <p className="text-sm">Try selecting different categories or check your API source.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articlesToDisplay.map((article: NewsArticle) => (
                    <ContentCard key={article.url} article={article} />
                ))}
            </div>
        );
    }

    return null;
};

export default NewsFeed;

