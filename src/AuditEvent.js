import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';

import template from './resources/auditEventTemplate.json';
import { getDateTimeString } from './utils';

const emptyBundle = Object.freeze({
  resourceType: 'Bundle',
  type: 'collection',
});

export function downloadBundle(auditEvents) {
  const bundle = {
    ...emptyBundle,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    entry: auditEvents.map(e => ({ resource: e, })),
  };
  const filename = `AuditEvents-${bundle.id}.json`;
  const blob = new Blob([JSON.stringify(bundle)], { type: 'application/fhir+json' });
  saveAs(blob, filename);
}

export default class AuditEvent {
  constructor(props = {}) {
    const {
      id = uuidv4(),
      language = "en",
      processor,
      time,
      ...rest
    } = props;


    Object.keys(template).forEach((k) => {
      this[k] = template[k];
    });

    this.id = id;
    this.language = language;
    this.recorded = getDateTimeString(time);

    Object.keys(rest).forEach((k) => {
      this[k] = rest[k];
    });

    this.text = {
      status: 'generated',
      div: `<div lang="${
        this.language
      }" xml:lang="${
        this.language
      }" xmlns="http://www.w3.org/1999/xhtml"><b>Type:</b> ${
        this.type.display
      }<br/><b>Subtypes:</b> ${
        this.subtype.map(s => s.display).join(',')
      }<br/><b>Recorded:</b> ${
        new Date(this.recorded).toLocaleString()
      }</div>`,
    };
    this.agent = [
      {
        type: {
          coding: [
            {
              system: 'http://dicom.nema.org/resources/ontology/DCM',
              code: '110152',
              display: 'Destination Role ID',
            },
          ]
        },
        network: {
          address: processor,
          type: '5',
        },
        who: {
          display: processor,
        },
        requestor: true,
      },
    ];

    this.source = {
      site: window.location.href,
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/security-source-type',
            code: '4',
            display: 'Application Server',
          },
        ]        
      },
    };

    this.entity = [
      {
        what: {
          reference: `${window.location.href}/Bundle/${uuidv4()}`,
          type: 'Bundle',
        },
        type: {
          system: 'http://terminology.hl7.org/CodeSystem/audit-entity-type',
          code: '2',
          display: 'System Object',
        },
        role: {
          system: 'http://terminology.hl7.org/CodeSystem/object-role',
          code: '4',
          display: 'Domain Resource',
        }
      },
      {
        what: {
          identifier: {
            value: uuidv4(),
          }
        },
        type: {
          system: 'https://profiles.ihe.net/ITI/BALP/CodeSystem/BasicAuditEntityType',
          code: 'XrequestId',
        },
      },
    ];
  }

  toString() {
    return JSON.stringify(this.text.div);
  }

  toJSON() {
    const {
      resourceType,
      id,
      meta,
      implicitRules,
      language,
      text,
      contained,
      extension,
      modifierExtension,
      type,
      subtype,
      action,
      period,
      recorded,
      outcome,
      outcomeDesc,
      purposeOfEvent,
      agent,
      source,
      entity,
    } = this;
    return {
      resourceType,
      id,
      meta,
      implicitRules,
      language,
      text,
      contained,
      extension,
      modifierExtension,
      type,
      subtype,
      action,
      period,
      recorded,
      outcome,
      outcomeDesc,
      purposeOfEvent,
      agent,
      source,
      entity,
    };
  }
}
