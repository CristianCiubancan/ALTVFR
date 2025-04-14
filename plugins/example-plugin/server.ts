import * as alt from 'alt-server';
import { registerServerPlugin } from '@framework/core/server';

const plugin = registerServerPlugin({
  name: 'example-plugin',
  version: '0.1.0',
  
  onStart() {
    alt.log('Example plugin started on server');
    
    // Register event handlers
    alt.onClient('example:requestData', (player) => {
      const data = 'Hello from server!';
      alt.emitClient(player, 'example:sendDataToUI', data);
    });
  },
  
  onStop() {
    alt.log('Example plugin stopped on server');
  }
});

export default plugin;