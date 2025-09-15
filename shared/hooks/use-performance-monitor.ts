import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  averageRenderTime: number;
  slowRenders: number;
  lastRenderTime: number;
}

export const usePerformanceMonitor = (componentName: string, enabled: boolean = __DEV__) => {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const slowRenderCount = useRef(0);
  const startTime = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    startTime.current = performance.now();
    renderCount.current += 1;

    return () => {
      const renderTime = performance.now() - startTime.current;
      renderTimes.current.push(renderTime);

      // Keep only last 50 render times for rolling average
      if (renderTimes.current.length > 50) {
        renderTimes.current.shift();
      }

      // 60fps threshold is ~16.67ms
      const FPS_60_THRESHOLD = 16.67;

      if (renderTime > FPS_60_THRESHOLD) {
        slowRenderCount.current += 1;

        // Log slow renders in development
        if (__DEV__) {
          console.warn(
            `🐌 Slow render detected in ${componentName}:`,
            `${renderTime.toFixed(2)}ms (target: <${FPS_60_THRESHOLD}ms)`
          );
        }
      }

      // Log performance metrics every 25 renders
      if (renderCount.current % 25 === 0 && __DEV__) {
        const averageRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
        const slowRenderPercentage = (slowRenderCount.current / renderCount.current) * 100;

        console.log(`📊 Performance metrics for ${componentName}:`, {
          totalRenders: renderCount.current,
          averageRenderTime: averageRenderTime.toFixed(2) + 'ms',
          slowRenders: slowRenderCount.current,
          slowRenderPercentage: slowRenderPercentage.toFixed(1) + '%',
          lastRenderTime: renderTime.toFixed(2) + 'ms'
        });
      }
    };
  });

  // Return current metrics for debugging
  const getMetrics = (): PerformanceMetrics => ({
    renderCount: renderCount.current,
    averageRenderTime: renderTimes.current.length > 0
      ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length
      : 0,
    slowRenders: slowRenderCount.current,
    lastRenderTime: renderTimes.current[renderTimes.current.length - 1] || 0
  });

  return { getMetrics };
};

// Hook for monitoring specific operations
export const useOperationPerformance = (operationName: string, enabled: boolean = __DEV__) => {
  const measureOperation = <T>(operation: () => T): T => {
    if (!enabled) return operation();

    const startTime = performance.now();
    const result = operation();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (duration > 50 && __DEV__) { // 50ms threshold for operations
      console.warn(
        `⏱️ Slow operation: ${operationName} took ${duration.toFixed(2)}ms`
      );
    }

    return result;
  };

  const measureAsyncOperation = async <T>(operation: () => Promise<T>): Promise<T> => {
    if (!enabled) return operation();

    const startTime = performance.now();
    const result = await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (duration > 100 && __DEV__) { // 100ms threshold for async operations
      console.warn(
        `⏱️ Slow async operation: ${operationName} took ${duration.toFixed(2)}ms`
      );
    }

    return result;
  };

  return { measureOperation, measureAsyncOperation };
};