import { base64url } from 'jose';
import { useContext, Fragment } from 'react';

import { downloadBundle } from './AuditEvent';
import { download, downloadSigned } from './ConsentReceipt';
import ProcessorsContext from './ProcessorsContext';

export function getPrimaryRecipient(permission) {
  return permission?.provision?.actor?.find(a => a?.role?.coding?.some(c =>
    (c.system === 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType')
    && (c.code === 'PRCP'))).reference?.display;
};

function renderNarrative(resource) {
  const narrative = resource.toString();
  return { __html: narrative.substring(1, narrative.length - 1) };
}

function Permission({ permission, receipt }) {

  const {
    auditEvents,
    givePermission,
    rejectPermission,
  } = useContext(ProcessorsContext);

  const {
    id,
    sourceAttachment,
    status,
  } = permission;

  const processor = receipt?.iss;

  const primaryRecipient = getPrimaryRecipient(permission);
  const purpose = sourceAttachment?.title;
  const details = sourceAttachment?.url

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
          <p>
            <a
              href={details}
              onClick={(e) => {
                e.preventDefault();
                alert(`This link would lead to the details describing the use of the data. These details are provided by the party asking for the data. In this demo case, the URL would be ${details}`);
              }}
            >
              Details...
            </a>
          </p>
        )
        : null
      }
      {status !== 'proposed'
        ? (
          <Fragment>
            <details>
              <summary>Inspect use...</summary>
              {auditEvents[processor].length
              ? (
                <Fragment>
                  <ul>
                    {auditEvents[processor].map((e => (
                      <li key={e.id} dangerouslySetInnerHTML={renderNarrative(e)} />
                    )))}
                  </ul>
                  <p>
                    <a
                      href={`?auditLog&id=${id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState(null, document.title, `?auditLog&id=${id}`);
                        downloadBundle(auditEvents[processor]);                        
                      }}
                    >
                      Download access log...
                    </a>
                  </p>
                </Fragment>
              )
              : (
              <p>No access yet</p>
              )
              }
            </details>
            <details>
              <summary>Download receipt...</summary>
              <p>
                You can download the receipt of the choice you have made regarding this permission
                request.
              </p>
              <p>
                There are many apps that help you manage these consent receipts, and to keep track
                of all the permissions you have given to different apps that care about your
                rights.
              </p>
              <p>
                <a
                  href={`?receipt&id=${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState(null, document.title, `?receipt&id=${id}`);
                    download(receipt, 'application/cr+json');
                  }}
                >
                  Download a plain Consent Receipt (JSON)
                </a>
              </p>
              <p>
                <a
                  href={`?receipt&id=${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState(null, document.title, `?receipt&id=${id}`);
                    downloadSigned(receipt);
                  }}
                >
                  Download a signed Consent Receipt (JWE)
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
                    const encoded = base64url.encode(JSON.stringify(receipt));
                    const fdUrl = 'https://fairdatasociety.github.io/fairdrive-desktop-app';
                    const fDwithdata = `${
                      fdUrl
                    }?file=%2Fconsent%2F${
                      id
                    }.json&data=${
                      encoded
                    }`;
                    try {
                      window.setTimeout(() => {
                        window.location = fDwithdata;
                      }, 200);
                      window.location = `fairdrive://fairdrive.org/consent/${
                        id
                      }.json?data=${
                        encoded
                      }`;
                    } catch {
                      window.location = fDwithdata;
                    }
                  }}
                >
                  Store to FairDrive
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
          </Fragment>
        )
        : null
      }

      {((status === 'proposed') || (status === 'rejected'))
        ? <button className="success" onClick={() => givePermission(processor)}>Allow</button>
        : null
      }
      {((status === 'proposed') || (status === 'active'))
        ? <button className="warning" onClick={() => rejectPermission(processor)}>Deny</button>
        : null
      }
    </div>
  );
}

export default Permission;
