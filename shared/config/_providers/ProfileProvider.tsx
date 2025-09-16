import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { useAppSelector } from '@/features/hooks/useRedux';
import { selectProfile } from '@/entities/profile/model';
import { IUserProfile } from '@/entities/profile/model/types';

interface ProfileContextType {
  profile: IUserProfile;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const profile = useAppSelector(selectProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile.id) {
      setIsLoading(false);
    }
  }, [profile.id]);


  // Мемоизируем значение для предотвращения лишних ререндеров
  const value = useMemo(() => ({
    profile,
    isLoading,
  }), [profile, isLoading]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
