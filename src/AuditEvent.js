import { v4 as uuidv4 } from 'uuid';

import template from './resources/auditEventTemplate.json';
import { getDateTimeString } from './utils';

export default class AuditEvent {
  constructor(props = {}) {
    const {
      id = uuidv4(),
      language = "en",
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
