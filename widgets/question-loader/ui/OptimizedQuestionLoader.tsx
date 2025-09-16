import React, { ReactNode, useEffect, useState, useMemo } from 'react';
import { useGetQuestionQuery } from '@/entities/question';
import { IQuestion } from '@/services/types/types';
import { IDisplayedCard } from '@/entities/card/ui';

interface OptimizedQuestionLoaderProps {
  displayData: IDisplayedCard;
  userId: string;
  children: (question?: IQuestion, isFetchingQuestion?: boolean, questionId?: string) => ReactNode;
}

export const OptimizedQuestionLoader: React.FC<OptimizedQuestionLoaderProps> = React.memo(({
  displayData,
  userId,
  children,
}) => {
  const [cachedQuestion, setCachedQuestion] = useState<IQuestion>();
  const [questionId, setQuestionId] = useState<string>();

  // Generate stable timestamp based on level ID for better caching
  const timestamp = useMemo(() => {
    if (!displayData.level?.id) return Date.now();

    // Создаем стабильный timestamp на основе levelId
    const levelIdHash = displayData.level.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.floor(Date.now() / (1000 * 60)) * 1000 + levelIdHash; // Обновляется каждую минуту
  }, [displayData.level?.id]);

  // Only fetch if we should load question and have level data
  const shouldFetch = Boolean(displayData.shouldLoadQuestion && displayData.level?.id);

  const {
    data: fetchedQuestion,
    isFetching,
    isSuccess,
    isError
  } = useGetQuestionQuery(
    shouldFetch ? {
      levelId: displayData.level!.id,
      clientId: userId,
      timestamp,
    } : {
      levelId: '',
      clientId: userId,
      timestamp
    },
    {
      skip: !shouldFetch,
      refetchOnMountOrArgChange: false, // Use cache when possible
    }
  );
  console.log('fetchedQuestion', fetchedQuestion);
  // Update cached question only when we have new successful data
  useEffect(() => {
    if (isSuccess && fetchedQuestion) {
      setCachedQuestion(fetchedQuestion);
      setQuestionId(fetchedQuestion.id);
    }
  }, [isSuccess, fetchedQuestion]);

  // Reset cached data only when level changes, not card ID
  useEffect(() => {
    setCachedQuestion(undefined);
    setQuestionId(undefined);
  }, [displayData.level?.id]); // Изменено: сбрасываем кэш только при смене уровня

  // Optimistic rendering logic
  const shouldShowContent = useMemo(() => {
    // Show cached content immediately if available
    if (cachedQuestion && questionId) {
      return true;
    }

    // Show loading state only if we're actively fetching and don't have cached data
    return false;
  }, [cachedQuestion, questionId]);

  const shouldShowLoading = useMemo(() => {
    // Show loading only if:
    // 1. We should load a question AND
    // 2. We're currently fetching AND
    // 3. We don't have cached content to show
    return shouldFetch && isFetching && !shouldShowContent;
  }, [shouldFetch, isFetching, shouldShowContent]);

  // Handle error states gracefully
  if (isError && !cachedQuestion) {
    // Return empty content or error state
    return children(undefined, false, undefined);
  }

  // Return the appropriate state
  const questionToRender = shouldShowContent ? cachedQuestion : undefined;
  const questionIdToRender = shouldShowContent ? questionId : undefined;

  return children(questionToRender, shouldShowLoading, questionIdToRender);
});