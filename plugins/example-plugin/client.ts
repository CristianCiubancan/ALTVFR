import * as alt from 'alt-client';
import { registerClientPlugin, ui } from '@framework/core/client';

const plugin = registerClientPlugin({
  name: 'example-plugin',
  version: '0.1.0',
  
  onStart() {
    alt.log('Example plugin started on client');
    
    // Register UI event handlers
    alt.onServer('example:sendDataToUI', (data) => {
      alt.emit('cef:example:getData', data);
    });
    
    alt.on('cef:example:requestData', () => {
      alt.emitServer('example:requestData');
    });
    
    // Example: Show UI when a key is pressed
    alt.on('keyup', (key) => {
      if (key === 0x4B) { // K key
        ui.show('/example');
      }
    });
  },
  
  onStop() {
    alt.log('Example plugin stopped on client');
  }
});

export default plugin;