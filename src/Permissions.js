import { useContext, useMemo } from 'react';

import Permission, { getPrimaryRecipient } from './Permission';
import ProcessorsContext from './ProcessorsContext';

function sortByRecipientName(a, b) {
  const nameA = getPrimaryRecipient(a);
  const nameB = getPrimaryRecipient(b);
  if (nameA > nameB) {
    return 1;
  }
  if (nameA < nameB) {
    return -1;
  }
  // sort by date, or some other parameter?
  return 0;
}

function Permissions() {
  const { processors } = useContext(ProcessorsContext);

  const categorizedPermissions = useMemo(() => {
    const categorized = Object.keys(processors).reduce((o, k) => {
      const { permission } = processors[k];
      const { status } = permission;
      if (!o[status]) {
        o[status] = [];
      }
      o[status].push({
        ...permission,
        processor: k,
      });
      return o;
    }, {});
    return {
      requestedPermissions: categorized.proposed?.sort(sortByRecipientName) || [],
      activePermissions: categorized.active?.sort(sortByRecipientName) || [],
      rejectedPermissions: categorized.rejected?.sort(sortByRecipientName) || [],
      inactivePermissions: categorized.inactive?.sort(sortByRecipientName) || [],
    };
  }, [processors]);

  const {
    requestedPermissions,
    activePermissions,
    rejectedPermissions,
    inactivePermissions,
  } = categorizedPermissions;
  
  return (
    <div>
      <h1>Permissions</h1>
      <p></p>
      {requestedPermissions.length
        ? (
          <section id="requested">
            <h2>Requested</h2>
            {requestedPermissions.map(p => (
              <Permission key={p.processor} data={p} />
            ))}
          </section>
        )
        : null
      }
      {activePermissions.length
        ? (
          <section id="active">
            <h2>Active</h2>
            {activePermissions.map(p => (
              <Permission key={p.processor} data={p} />
            ))}
          </section>
        )
        : null
      }
      {rejectedPermissions.length
        ? (
          <section id="rejected">
            <h2>Rejected</h2>
            {rejectedPermissions.map(p => (
              <Permission key={p.processor} data={p} />
            ))}
          </section>
        )
        : null
      }
      {inactivePermissions.length
        ? (
          <section id="inactive">
            <h2>Inactive</h2>
            {inactivePermissions.map(p => (
              <Permission key={p.processor} data={p} />
            ))}
          </section>
        )
        : null
      }

    </div>
  );
}

export default Permissions;
