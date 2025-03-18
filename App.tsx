import { useEffect } from 'react';
import { useAppDispatch } from '@/features/hooks/useRedux';
import { initializeProfile } from '@/store/reducer/profile-slice';

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeProfile());
  }, [dispatch]);

  // ... остальной код App.tsx ...
} 