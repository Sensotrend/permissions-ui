import { useContext } from "react";

import PermissionsContext from "./PermissionsContext";

export function getPrimaryRecipient(permission) {
  return permission?.provision?.actor?.find(a => a?.role?.coding?.some(c =>
    (c.system === 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType')
    && (c.code === 'PRCP'))).reference?.display;
};

function Permission({ data }) {

  const {
    givePermission,
    rejectPermission,
  } = useContext(PermissionsContext);

  const {
    id,
    sourceAttachment,
    status,
  } = data;

  const primaryRecipient = getPrimaryRecipient(data);
  const purpose = sourceAttachment?.title;

  return (
    <div id={`permission-${id}`} className="permission">
      {primaryRecipient
        ? (
          <h3>{primaryRecipient}</h3>
        )
        : null
      }
      {purpose
        ? (
          <p>{purpose}</p>
        )
        : null
      }
      {((status === 'proposed') || (status === 'rejected'))
        ? <button className="success" onClick={() => givePermission(id)}>Allow</button>
        : null
      }
      {((status === 'proposed') || (status === 'active'))
        ? <button className="warning" onClick={() => rejectPermission(id)}>Deny</button>
        : null
      }
    </div>
  );
}

export default Permission;
