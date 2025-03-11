
import React, { useState, useEffect } from 'react';
import PollCard from '@/components/polls/PollCard';
import { Poll } from '@/lib/types';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Polls = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchPolls = async () => {
      setIsLoading(true);
      
      try {
        const { data: pollsData, error: pollsError } = await supabase
          .from('polls')
          .select(`
            id,
            question,
            author_id,
            is_anonymous,
            created_at,
            expires_at,
            total_votes,
            profiles:author_id (
              id,
              name,
              username,
              email,
              image,
              created_at,
              default_anonymous
            ),
            poll_options (
              id,
              text,
              votes
            )
          `)
          .order('created_at', { ascending: false });
          
        if (pollsError) {
          console.error('Error fetching polls:', pollsError);
          throw pollsError;
        }
        
        // Format polls data
        const formattedPolls: Poll[] = pollsData.map(poll => ({
          id: poll.id,
          question: poll.question,
          authorId: poll.author_id,
          author: poll.is_anonymous ? undefined : {
            id: poll.profiles?.id || '',
            name: poll.profiles?.name || '',
            username: poll.profiles?.username || '',
            email: poll.profiles?.email || '',
            image: poll.profiles?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${poll.profiles?.username || poll.profiles?.id || poll.author_id}`,
            createdAt: new Date(poll.profiles?.created_at || poll.created_at),
            defaultAnonymous: poll.profiles?.default_anonymous || false,
          },
          isAnonymous: poll.is_anonymous,
          createdAt: new Date(poll.created_at),
          expiresAt: poll.expires_at ? new Date(poll.expires_at) : undefined,
          totalVotes: poll.total_votes,
          options: poll.poll_options.map(option => ({
            id: option.id,
            text: option.text,
            votes: option.votes,
          })),
        }));
        
        setPolls(formattedPolls);
        setFilteredPolls(formattedPolls);
      } catch (error) {
        console.error('Error fetching polls:', error);
        toast({
          title: "Error loading polls",
          description: "Could not load polls. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPolls(polls);
    } else {
      const filtered = polls.filter(poll => 
        poll.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poll.options.some(option => option.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (!poll.isAnonymous && poll.author?.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPolls(filtered);
    }
  }, [searchQuery, polls]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card border rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-3 w-16 bg-muted rounded"></div>
                </div>
              </div>
              <div className="h-5 w-3/4 bg-muted rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-10 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredPolls.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No polls found matching your search.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredPolls.map(poll => (
          <div key={poll.id} className="animate-slideIn">
            <PollCard poll={poll} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app-container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Polls</h1>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search polls..."
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

export default Polls;
