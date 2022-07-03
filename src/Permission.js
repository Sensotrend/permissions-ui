import { useContext } from 'react';

import { download } from './ConsentReceipt';
import PermissionsContext from './PermissionsContext';
import consentDetails from './resources/consentDetailsGoodHealth.json';

export function getPrimaryRecipient(permission) {
  return permission?.provision?.actor?.find(a => a?.role?.coding?.some(c =>
    (c.system === 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType')
    && (c.code === 'PRCP'))).reference?.display;
};

function renderNarrative(resource) {
  const narrative = resource.toString();
  return { __html: narrative.substring(1, narrative.length - 1) };
}

function Permission({ data }) {

  const {
    auditEvents,
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
  const details = sourceAttachment?.url
  const used = auditEvents[id]?.length;

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
      {details
        ? (
          <p><a href={details}>Details...</a></p>
        )
        : null
      }
      {used
        ? (
          <details>
            <summary>Inspect use...</summary>
            <ul>
              {auditEvents[id].map((e => (
                <li key={e.id} dangerouslySetInnerHTML={renderNarrative(e)} />
              )))}
            </ul>
            <p>
            <a
              href={`?auditLog&id=${id}`}
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, document.title, `?auditLog&id=${id}`);
              }}
            >
              Download access log...
            </a>
          </p>

          </details>
        )
        : null
      }
      {status !== 'proposed'
        ? (
          <details>
            <summary>Download receipt...</summary>
            <p>
              You can download the receipt of the choice you have made regarding this
              permission request.
            </p>
            <p>
              There are many apps that help you manage these consent receipts, and to 
              keep track of all the permissions you have given to different apps that care
              about your rights.
            </p>
            <p>
              <a
                href={`?receipt&id=${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, document.title, `?receipt&id=${id}`);
                  download(consentDetails);
                }}
              >
                Download Consent Receipt (JWE)
              </a>
            </p>
            <p>
              <a
                href={`?receipt&id=${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert('This integration is not yet implemented.');
                }}
              >
                Manage with DataYogi
              </a>
            </p>
            <p>
              <a
                href={`?receipt&id=${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert('This integration is not yet implemented.');
                }}
              >
                Manage with DigiMe
              </a>
            </p>
            <p>
              <a
                href={`?receipt&id=${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert('This integration is not yet implemented.');
                }}
              >
                Manage with Fair&amp;Smart
              </a>
            </p>
            <p>
              <a
                href={`?receipt&id=${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert('This integration is not yet implemented.');
                }}
              >
                Manage with FairDrop
              </a>
            </p>
            <p>
              <a
                href={`?receipt&id=${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert('This integration is not yet implemented.');
                }}
              >
                Manage with Meeco
              </a>
            </p>

          </details>


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
