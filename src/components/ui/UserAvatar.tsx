
import React from 'react';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { User as UserIcon } from 'lucide-react';

interface UserAvatarProps {
  user: User | null;
  size?: 'sm' | 'md' | 'lg';
  isAnonymous?: boolean;
}

const UserAvatar = ({ user, size = 'md', isAnonymous = false }: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
  };
  
  const containerClasses = cn(
    'rounded-full flex items-center justify-center overflow-hidden transition-all duration-300',
    sizeClasses[size],
    isAnonymous ? 'bg-secondary text-secondary-foreground' : 'bg-primary/10 text-primary'
  );
  
  if (isAnonymous) {
    return (
      <div className={containerClasses}>
        <UserIcon size={size === 'lg' ? 24 : 16} />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className={containerClasses}>
        <UserIcon size={size === 'lg' ? 24 : 16} />
      </div>
    );
  }
  
  // Use the first letter of the name if no image
  const initial = user.name.charAt(0).toUpperCase();
  
  if (user.image) {
    return (
      <div className={containerClasses}>
        <img 
          src={user.image} 
          alt={user.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }
  
  return (
    <div className={containerClasses}>
      {initial}
    </div>
  );
};

export default UserAvatar;
