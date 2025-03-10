
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '@/components/ui/UserAvatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from '@/components/posts/PostCard';
import PollCard from '@/components/polls/PollCard';
import { Post, Poll } from '@/lib/types';
import { User } from 'lucide-react';

const Profile = () => {
  const { user, isLoading } = useAuth();
  const [defaultAnonymous, setDefaultAnonymous] = useState(false);
  
  // Mock data for user's posts and polls
  const userPosts: Post[] = [
    {
      id: '1',
      content: 'Just experienced the most amazing sunset at the beach. Nature\'s beauty is truly breathtaking sometimes.',
      authorId: user?.id || '',
      author: user || undefined,
      isAnonymous: false,
      createdAt: new Date('2022-03-05'),
      updatedAt: new Date('2022-03-05'),
      likes: 24,
      comments: 5,
    },
    {
      id: '2',
      content: 'Just finished reading "Atomic Habits" and it completely changed my perspective on building good routines.',
      authorId: user?.id || '',
      author: user || undefined,
      isAnonymous: false,
      createdAt: new Date('2022-03-08'),
      updatedAt: new Date('2022-03-08'),
      likes: 42,
      comments: 7,
    },
  ];
  
  const userPolls: Poll[] = [
    {
      id: '1',
      question: 'What\'s your preferred way to work?',
      options: [
        { id: '1', text: 'Remote work', votes: 25 },
        { id: '2', text: 'Office work', votes: 10 },
        { id: '3', text: 'Hybrid approach', votes: 35 },
      ],
      authorId: user?.id || '',
      author: user || undefined,
      isAnonymous: false,
      createdAt: new Date('2022-03-10'),
      totalVotes: 70,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    },
  ];
  
  // Mock data for anonymous posts and polls
  const anonymousPosts: Post[] = [
    {
      id: '3',
      content: 'Sometimes I feel like I\'m not making enough progress in my career. Does anyone else feel this way?',
      authorId: user?.id || '',
      author: user || undefined,
      isAnonymous: true,
      createdAt: new Date('2022-02-20'),
      updatedAt: new Date('2022-02-20'),
      likes: 42,
      comments: 7,
    },
  ];
  
  const anonymousPolls: Poll[] = [
    {
      id: '2',
      question: 'Which programming language do you prefer?',
      options: [
        { id: '1', text: 'JavaScript', votes: 42 },
        { id: '2', text: 'Python', votes: 38 },
        { id: '3', text: 'Java', votes: 15 },
        { id: '4', text: 'C#', votes: 20 },
        { id: '5', text: 'Other', votes: 10 },
      ],
      authorId: user?.id || '',
      author: user || undefined,
      isAnonymous: true,
      createdAt: new Date('2022-03-15'),
      totalVotes: 125,
    },
  ];
  
  if (isLoading) {
    return (
      <div className="app-container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-muted"></div>
              <div className="space-y-2">
                <div className="h-6 w-48 bg-muted rounded"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container py-8 animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          <div className="bg-card border rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <UserAvatar user={user} size="lg" />
              <div className="text-center md:text-left">
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-muted-foreground">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
                
                <div className="flex gap-4 mt-4 justify-center md:justify-start">
                  <div className="text-center">
                    <p className="font-semibold text-lg">{userPosts.length + anonymousPosts.length}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg">{userPolls.length + anonymousPolls.length}</p>
                    <p className="text-sm text-muted-foreground">Polls</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <div className="bg-card border rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="default-anonymous" className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium">Default to anonymous</p>
                    <p className="text-sm text-muted-foreground">When enabled, your posts and polls will be anonymous by default</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="default-anonymous"
                      className="sr-only"
                      checked={defaultAnonymous}
                      onChange={() => setDefaultAnonymous(!defaultAnonymous)}
                    />
                    <div className={`block w-14 h-8 rounded-full transition-colors ${defaultAnonymous ? 'bg-primary' : 'bg-muted'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${defaultAnonymous ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </label>
              </div>
              
              <div>
                <label className="block font-medium mb-1">Email address</label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={user?.email}
                    readOnly
                    className="flex-1 p-2 rounded-md border bg-muted text-muted-foreground"
                  />
                  <button className="btn-secondary">
                    Change
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <button className="text-destructive hover:text-destructive/80 text-sm font-medium transition-colors">
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Your Content</h2>
          <div className="bg-card border rounded-lg">
            <Tabs defaultValue="posts">
              <TabsList className="w-full border-b rounded-none justify-start">
                <TabsTrigger value="posts" className="flex-1 md:flex-none">Posts</TabsTrigger>
                <TabsTrigger value="polls" className="flex-1 md:flex-none">Polls</TabsTrigger>
                <TabsTrigger value="anonymous" className="flex-1 md:flex-none">
                  <User size={16} className="mr-2" />
                  Anonymous
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="p-4">
                {userPosts.length > 0 ? (
                  <div className="space-y-4">
                    {userPosts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">You haven't created any posts yet.</p>
                )}
              </TabsContent>
              
              <TabsContent value="polls" className="p-4">
                {userPolls.length > 0 ? (
                  <div className="space-y-4">
                    {userPolls.map(poll => (
                      <PollCard key={poll.id} poll={poll} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">You haven't created any polls yet.</p>
                )}
              </TabsContent>
              
              <TabsContent value="anonymous" className="p-4">
                {anonymousPosts.length > 0 || anonymousPolls.length > 0 ? (
                  <div className="space-y-4">
                    {anonymousPosts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                    {anonymousPolls.map(poll => (
                      <PollCard key={poll.id} poll={poll} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">You haven't created any anonymous content yet.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
