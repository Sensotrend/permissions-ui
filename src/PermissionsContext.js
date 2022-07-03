import React, { useEffect, useRef, useState } from 'react';

import acmePermission from './resources/permissionRequestACME.json';
import goodHealthPermission from './resources/permissionRequestGoodHealth.json';
import dubiousPermission from './resources/permssionRequestDubiousInc.json';

// HL7 FHIR Consent resources.
// You would normally get these from the backend server.
// These are all initially in the 'proposed' state.
const permissionRequests = [
  goodHealthPermission,
  acmePermission,
  dubiousPermission,
].reduce((o, p) => {
  o[p.id] = p;
  return o;
}, {});

const PermissionsContext = React.createContext({
  auditEvents: {},
  permissions: permissionRequests,
  givePermission: f => f,
  rejectPermission: f => f,
});

export function PermissionsContextProvider({ permissions : propsPermissions, children }) {

  // const [context, setContext] = useState(propsPermissions || permissionRequests);
  const [permissions, setPermissions] = useState(propsPermissions || permissionRequests);

  const [auditEvents, setAuditEvents] = useState(Object.keys(permissions).reduce((o, k) => {
    o[k] = [];
    return o;
  }, {}));

  useEffect(() => {
    let timeoutId;
    function accessData() {
      Object.values(permissions).filter(p => p.status === 'active').forEach((p) => {
        logAccess(p);
      });
      timeoutId = setTimeout(accessData, 10000);
    }
    accessData();
    return (() => {
      clearTimeout(timeoutId);
    });
  }, [permissions]);

  const { location } = window;
  const { search } = location;

  useEffect(() => {
    console.log('Noticing location change!!');
  }, [search]);


  function get(permissionId) {
    const permission = permissions[permissionId];
    if (!permission || permission.status === 'inactive') {
      // Not modifying an unknown or inactive permission.
      return undefined;
    }
    // Make a new object so context listeners notice the change!
    return { ...permission };
  }

  function givePermission(permissionId) {
    const permission = get(permissionId);
    if (!permission) {
      return;
    }
    permission.status = 'active';
    set(permission);
  }

  function rejectPermission(permissionId) {
    const permission = get(permissionId);
    if (!permission) {
      return;
    }
    permission.status = 'rejected';
    set(permission);
  }

  function logAccess(permission) {
    const auditEvent = {
      time: new Date().getTime(),
      items: auditEvents[permission.id]?.length,
    };
    const newAuditEvents = {
      ...auditEvents,
    };

    newAuditEvents[permission.id].push(auditEvent);
    setAuditEvents(newAuditEvents);
  }

  function set(permission) {
    const newPermissions = {
      ...permissions,
      [permission.id]: permission,
    };
    setPermissions(newPermissions);
  }

  const state = Object.freeze({
    auditEvents,
    permissions,
    givePermission,
    rejectPermission,
  });

  return (
    <PermissionsContext.Provider value={state}>
      {children}
    </PermissionsContext.Provider>
  );
}

export default PermissionsContext;
