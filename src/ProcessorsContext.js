import React, { useEffect, useState } from 'react';
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

  const [auditEvents, setAuditEvents] = useState(Object.keys(processors).reduce((o, k) => {
    o[k] = [];
    return o;
  }, {}));

  useEffect(() => {
    let timeoutId;
    function accessData() {
      Object.keys(processors).filter(k => processors[k].permission.status === 'active').forEach((k) => {
        logAccess(k);
      });
      timeoutId = setTimeout(accessData, 30000);
    }
    accessData();
    return (() => {
      clearTimeout(timeoutId);
    });
  }, [processors]);

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

  function logAccess(processor) {
    const auditEvent = new AuditEvent();
    const newAuditEvents = {
      ...auditEvents,
    };

    newAuditEvents[processor].push(auditEvent);
    setAuditEvents(newAuditEvents);
  }

  function set(processorId, permission) {
    const newProcessors = {
      ...processors,
      [processorId]: {
        ...processors.processorId,
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
