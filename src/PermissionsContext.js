import React, { useState } from 'react';

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
  o.permissions[p.id] = p;
  return o;
}, {
  permissions: {},
  lastModified: new Date(),
});

const PermissionsContext = React.createContext({
  context: {
    permissions: permissionRequests,
    lastModified: new Date(),
  },
  givePermission: f => f,
  rejectPermission: f => f,
});

export function PermissionsContextProvider({ permissions : propsPermissions, children }) {

  // const [permissions, setPermissions] = useState(propsPermissions || permissionRequests);
  const [context, setContext] = useState(propsPermissions || permissionRequests);

  function get(permissionId) {
    const permission = context.permissions[permissionId];
    if (!permission || permission.status === 'inactive') {
      // Not modifying an unknown or inactive permission.
      return undefined;
    }
    return permission;
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

  function set(permission) {
    const newPermissions = {
      permissions: {
        ...context.permissions,
        [permission.id]: permission,
      },
      lastModified: new Date(),
    };
    setContext(newPermissions);
  }

  const state = Object.freeze({
    context,
    givePermission,
    rejectPermission,
    lastModified: new Date(),
  });

  return (
    <PermissionsContext.Provider value={state}>
      {children}
    </PermissionsContext.Provider>
  );
}

export default PermissionsContext;
