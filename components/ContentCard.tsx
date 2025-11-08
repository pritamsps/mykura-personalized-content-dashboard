import React from "react";
import Image from 'next/image';

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

interface ContentCardProps {
    article: NewsArticle;
}

const ContentCard: React.FC<ContentCardProps> = ({ article }) => {
    const imageUrl = article.urlToImage || `https://placehold.co/400x200/cccccc/333333?text=No+Image`;
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <Image
                src={imageUrl}
                alt={article.title || 'News Image'}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
            />

            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {article.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                    {article.description || 'No description available.'}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>{article.source.name || 'Unknown Source'}</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                    Read More
                </a>
            </div>
        </div>
    );
};

export default ContentCard;

