
import React, { useState } from 'react';
import { Post } from '@/lib/types';
import UserAvatar from '@/components/ui/UserAvatar';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Trash2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CommentSection from '@/components/comments/CommentSection';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if the current user has liked this post
  React.useEffect(() => {
    if (!user) return;
    
    const checkLikeStatus = async () => {
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .single();
      
      setLiked(!!data);
    };
    
    checkLikeStatus();
  }, [post.id, user]);
  
  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to like posts.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (liked) {
        // Unlike the post
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
        
        setLikeCount(prev => prev - 1);
        setLiked(false);
      } else {
        // Like the post
        await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: user.id
          });
        
        setLikeCount(prev => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!user || user.id !== post.authorId) {
      toast({
        title: "Unauthorized",
        description: "You can only delete your own posts.",
        variant: "destructive",
      });
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);
      
      if (error) throw error;
      
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully.",
      });
      
      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post on VibeSphere',
          text: post.content,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Post link copied to clipboard!",
        });
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };
  
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const isAuthor = user && user.id === post.authorId;
  
  return (
    <div className="bg-card border rounded-lg overflow-hidden transition-all duration-300 card-hover animate-fadeIn">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar 
              user={post.author || null} 
              isAnonymous={post.isAnonymous} 
            />
            <div>
              <h3 className="font-medium text-card-foreground">
                {post.isAnonymous ? 'Anonymous' : post.author?.name}
              </h3>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
          {isAuthor && (
            <div className="relative">
              <button 
                className="text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors"
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              >
                <MoreHorizontal size={18} />
              </button>
              
              {showDeleteConfirm && (
                <div className="absolute right-0 top-8 bg-background border rounded-md shadow-md p-3 z-10 w-56">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Delete post?</h4>
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full flex items-center justify-center gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm px-3 py-2 rounded-md"
                  >
                    <Trash2 size={14} />
                    {isDeleting ? 'Deleting...' : 'Delete Post'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-3">
          <p className="text-card-foreground">{post.content}</p>
        </div>
      </div>
      
      {/* Actions */}
      <div className="border-t flex items-center justify-between px-4 py-2">
        <button 
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md transition-colors",
            liked 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <ThumbsUp size={16} className={liked ? "fill-primary" : ""} />
          <span>{likeCount}</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 px-2 py-1 rounded-md transition-colors"
        >
          <MessageSquare size={16} />
          <span>{post.comments}</span>
        </button>
        
        <button 
          onClick={handleShare}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 px-2 py-1 rounded-md transition-colors"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <CommentSection contentId={post.id} contentType="post" />
      )}
    </div>
  );
};

export default PostCard;
