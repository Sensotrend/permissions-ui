import React, { Fragment, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { HashLink as Link } from 'react-router-hash-link';


import PresentationContext from './PresentationContext';
import SharingPreferencesContext, { keys, options } from './SharingPreferencesContext';

const [always, ondemand] = options;

function joinAndTranslate(array, t, context) {
  return `${array.length > 1
    ? array.slice(0, array.length - 1).map(e => t(`sharing.forCategory.${e}`))
      .join(t('sharing.listSeparator'))
    : ''
  }${
    array.length > 1 ? t('sharing.listLastSeparator', { context }) : ''
  }${
    t(`sharing.forCategory.${array[array.length - 1]}`)
  }.`
}

function Phrase({ children }) {
  return (
    <p className="sharingPreference">
      <strong>
        {children}
      </strong>
    </p>
  );
}

function SharingPreferencesSummary() {
  const { formatDate } = useContext(PresentationContext);
  const { sharingPreferences: state } = useContext(SharingPreferencesContext);
  const { t } = useTranslation('account');

  const categorized = keys.reduce((o, k) => {
    if (state[k] === always) {
      o.always.push(k);
    } else if (state[k] === ondemand) {
      o.ondemand.push(k);
    } else {
      o.never.push(k);
    }
    return o;
  }, {
    always: [],
    ondemand: [],
    never: [],
  });


  let description;
  if (!categorized.always.length && !categorized.ondemand.length) {
    description = <Phrase>{t('sharing.shareNothing')}</Phrase>
  } else if (!categorized.ondemand.length && !categorized.never.length) {
    description = <Phrase>{t('sharing.shareAllWithoutAsking')}</Phrase>
  } else if (!categorized.always.length && !categorized.never.length) {
    description = <Phrase>{t('sharing.shareAllWithPermission')}</Phrase>
  } else {
    const describeAlways = categorized.always.length
    ? (
      <Phrase>
        {`${t('sharing.shareWithoutAsking')}${joinAndTranslate(categorized.always, t)}`}
      </Phrase>
    )
    : undefined;
    const describeOndemand = categorized.ondemand.length
    ? (
      <Phrase>
        {`${t('sharing.shareWithPermission')}${joinAndTranslate(categorized.ondemand, t)}`}
      </Phrase>
    )
    :undefined;
    const describeNever = categorized.never.length
    ? (
      <Phrase>
        {`${t('sharing.neverShare')}${joinAndTranslate(categorized.never, t, 'negative')}`}
      </Phrase>
    )
    :undefined;
    description = (
      <Fragment>
        {describeAlways}
        {describeOndemand}
        {describeNever}
      </Fragment>
    )
  }

  return (
    <Fragment>
      {description}
      <div className="cta">
        <Link
          className="secondary button"
          to="/sharing/preferences"
        >
          {t('sharing.edit')}
        </Link>
        {state.stored
        ? (
          <small className="footerNote">
            <span>
              {t('sharing.lastSaved')}
            </span> <time dateTime={state.stored.toISOString()}>
              {formatDate(state.stored)}
            </time>.
          </small>
        )
        : undefined
        }
      </div>
    </Fragment>
  );
}

export default SharingPreferencesSummary;
