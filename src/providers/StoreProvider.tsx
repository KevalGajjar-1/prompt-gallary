'use client';

import { useRef, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null); // allow null initially [4][8]
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize the store on the client side
  useEffect(() => {
    if (!storeRef.current) {
      storeRef.current = makeStore();
      setIsInitialized(true);
    }
  }, []);

  // Show loading state while store is being initialized
  if (!isInitialized || !storeRef.current) {
    return null; // or a loading spinner
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
