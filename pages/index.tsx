import PreferencesPanel from '@/components/PreferencesPanel'
import DashboardLayout from '@/components/Layout/DashboardLayout';
import NewsFeed from '@/components/NewsFeed';
import SocialFeed from '@/components/SocialFeed';

export default function Home() {
  return (
   <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-8">
        <h1 className="text-3xl font-bold mb-8">Your Personalized Feed</h1>
        <div className="mt-8 w-full max-w-lg px-4">
          <PreferencesPanel />
        </div>
        <div className="mt-12 w-full max-w-4xl px-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">News Articles</h2>
            <NewsFeed />
        </div>
        <div className="mt-12 w-full max-w-4xl px-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Social Posts</h2>
            <SocialFeed />
        </div>
      </div>
    </DashboardLayout>
    
  );
}
