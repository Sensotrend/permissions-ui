import React, { useState } from 'react';

const [treatment, improvement, medicalResearch, research, other] = [
  'My treatment',
  'Improving medical practices',
  'Medical research',
  'Other scientific research',
  'Other purposes'
];
const [always, ondemand] = ['always', 'upon specific request'];

export const keys = Object.freeze([treatment, improvement, medicalResearch, research, other]);
export const options = Object.freeze([always, ondemand]);

const initialState = keys.reduce((o, k) => {
  o[k] = ondemand;
  return o;
}, {});

const SharingPreferencesContext = React.createContext(initialState);

export function SharingPreferencesContextProvider({ preferences, children }) {

  const [sharingPreferences, setSharingPreferences] = useState(preferences || initialState);

  function storePreferences(preferences) {
    setSharingPreferences(Object.freeze({
      ...preferences,
      stored: new Date(),
    }));
  }

  const state = Object.freeze({
    sharingPreferences,
    setSharingPreferences: storePreferences,
  });
  
  return (
    <SharingPreferencesContext.Provider value={state}>
      { children }
    </SharingPreferencesContext.Provider>
  );
}

export default SharingPreferencesContext;
