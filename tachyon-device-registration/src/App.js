// src/App.js
import React, { useState } from 'react';
import DeviceRegistrationView from './views/DeviceRegistrationView';
import DeviceAvailabilityView from './views/DeviceAvailabilityView';
import { handleDeviceRegistration, handleDeviceAvailabilityCheck } from './controllers/deviceController';

function App() {
  const [result, setResult] = useState('');

  return (
    <div>
      <DeviceRegistrationView onSubmit={(deviceData) => handleDeviceRegistration(deviceData, setResult)} />
      <DeviceAvailabilityView onSubmit={(deviceName, password) => handleDeviceAvailabilityCheck(deviceName, password, setResult)} />

      {result && <p className="result-message">{result}</p>}
    </div>
  );
}

export default App;
