import React, { useState, useEffect } from 'react';
import { useAltV } from '@framework/ui/components/providers/AltVProvider';
import { Button } from '@framework/ui/components/common/Button';
import { Container } from '@framework/ui/components/layout/Container';

export default function ExampleComponent() {
  const { isConnected, events } = useAltV();
  const [data, setData] = useState<string>('');
  const [clickCount, setClickCount] = useState(0);
  
  useEffect(() => {
    // Listen for data from client
    const unsubscribe = events.on('example:getData', (newData) => {
      setData(newData);
    });
    
    // Request data when component mounts
    events.emit('example:requestData');
    
    return () => unsubscribe();
  }, [events]);
  
  const handleClick = () => {
    setClickCount(prev => prev + 1);
    // Example of sending event to client
    events.emit('example:buttonClicked', { count: clickCount + 1 });
  };
  
  return (
    <Container maxWidth="md" centered padding="large">
      <div className="bg-altv-background/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-altv-primary">Example Plugin</h1>
        
        <p className="text-gray-300 mb-4">
          {isConnected 
            ? 'Connected to alt:V' 
            : 'Not connected to alt:V - running in browser mode'}
        </p>
        
        {data && (
          <div className="bg-gray-700 p-4 rounded mb-4">
            <p className="text-gray-200">{data}</p>
          </div>
        )}
        
        <Button variant="primary" onClick={handleClick}>
          Click Me {clickCount > 0 ? `(${clickCount})` : ''}
        </Button>
      </div>
    </Container>
  );
}