
import React, { useState, useEffect } from 'react';
import PostCard from '@/components/posts/PostCard';
import { Post } from '@/lib/types';
import { Search } from 'lucide-react';

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      const mockPosts: Post[] = [
        {
          id: '1',
          content: 'I just launched a new project and I\'m really excited about it! What do you think?',
          authorId: '1',
          author: {
            id: '1',
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            createdAt: new Date('2022-01-15'),
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          },
          isAnonymous: false,
          createdAt: new Date('2022-01-15'),
          updatedAt: new Date('2022-01-15'),
          likes: 15,
          comments: 2,
        },
        {
          id: '2',
          content: 'Sometimes I feel like I\'m not making enough progress in my career. Does anyone else feel this way?',
          authorId: '2',
          author: {
            id: '2',
            name: 'Jane Smith',
            username: 'janesmith',
            email: 'jane@example.com',
            createdAt: new Date('2022-02-20'),
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
          },
          isAnonymous: true,
          createdAt: new Date('2022-02-20'),
          updatedAt: new Date('2022-02-20'),
          likes: 42,
          comments: 7,
        },
        {
          id: '3',
          content: 'Just experienced the most amazing sunset at the beach. Nature\'s beauty is truly breathtaking sometimes.',
          authorId: '3',
          author: {
            id: '3',
            name: 'Sarah Johnson',
            username: 'sarahj',
            email: 'sarah@example.com',
            createdAt: new Date('2022-03-05'),
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          },
          isAnonymous: false,
          createdAt: new Date('2022-03-05'),
          updatedAt: new Date('2022-03-05'),
          likes: 24,
          comments: 5,
        },
        {
          id: '4',
          content: 'Just finished reading "Atomic Habits" and it completely changed my perspective on building good routines.',
          authorId: '4',
          author: {
            id: '4',
            name: 'Jamie Smith',
            username: 'jamies',
            email: 'jamie@example.com',
            createdAt: new Date('2022-03-08'),
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie',
          },
          isAnonymous: false,
          createdAt: new Date('2022-03-08'),
          updatedAt: new Date('2022-03-08'),
          likes: 42,
          comments: 7,
        },
      ];

      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (!post.isAnonymous && post.author?.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-3 w-16 bg-muted rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-5/6 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posts found matching your search.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="animate-slideIn">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app-container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Posts</h1>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default Posts;
