import React, { useEffect, useReducer, useRef, useState } from 'react';
import AuditEvent from './AuditEvent';

// HL7 FHIR Consent resources.
// You would normally get these from the backend server.
// These are all initially in the 'proposed' state.
import acmePermission from './resources/permissionRequestACME.json';
import goodHealthPermission from './resources/permissionRequestGoodHealth.json';
import dubiousPermission from './resources/permssionRequestDubiousInc.json';

// Details of the consent receipt
import acmeDetails from './resources/consentDetailsACME.json';
import dubiousDetails from './resources/consentDetailsDubious.json';
import goodHealthDetails from './resources/consentDetailsGoodHealth.json';

const defaultProcessors = [
  {
    details: goodHealthDetails,
    permission: goodHealthPermission,
  },
  {
    details: acmeDetails,
    permission: acmePermission,
  },
  {
    details: dubiousDetails,
    permission: dubiousPermission,
  },
].reduce((o, p) => {
  o[p.details.iss] = p;
  return o;
}, {});

const ProcessorsContext = React.createContext({
  auditEvents: {},
  processors: defaultProcessors,
  givePermission: f => f,
  rejectPermission: f => f,
});

export function ProcessorsContextProvider({ processors : propsProcessors, children }) {

  const [processors, setProcessors] = useState(propsProcessors || defaultProcessors);

  function auditEventReducer(state, action) {
    return {
      ...state,
      [action.processor]: [...state[action.processor], action.event],
    };
  }

  const initialEvents = Object.keys(processors).reduce((o, k) => {
    o[k] = [];
    return o;
  }, {});

  const [auditEvents, addAuditEvent] = useReducer(auditEventReducer, initialEvents);

  const activeProcessors = useRef([]);

  useEffect(() => {
    activeProcessors.current = Object.keys(processors)
      .filter(k => processors[k].permission.status === 'active');
  }, [processors]);

  useEffect(() => {
    let timeoutId;

    function logAccess() {
      activeProcessors.current.forEach((processor) => {
        addAuditEvent({ processor, event: new AuditEvent() });
      });
      timeoutId = setTimeout(() => {
        logAccess();
      }, 30000);
    }
    logAccess();

    return (() => {
      clearTimeout(timeoutId);
    });
  }, []);

  function getPermission(processorId) {
    const { permission } = processors[processorId] || {};
    if (!permission || permission.status === 'inactive') {
      // Not modifying an unknown or inactive permission.
      return undefined;
    }
    // Make a new object so context listeners notice the change!
    return { ...permission };
  }

  function givePermission(processorId) {
    const permission = getPermission(processorId);
    if (!permission) {
      return;
    }
    permission.status = 'active';
    set(processorId, permission);
  }

  function rejectPermission(processorId) {
    const permission = getPermission(processorId);
    if (!permission) {
      return;
    }
    permission.status = 'rejected';
    set(processorId, permission);
  }

  function set(processorId, permission) {
    const newProcessors = {
      ...processors,
      [processorId]: {
        ...processors[processorId],
        permission,
      }
    }
    setProcessors(newProcessors);
  }

  const state = Object.freeze({
    auditEvents,
    processors,
    givePermission,
    rejectPermission,
  });

  return (
    <ProcessorsContext.Provider value={state}>
      {children}
    </ProcessorsContext.Provider>
  );
}

export default ProcessorsContext;
