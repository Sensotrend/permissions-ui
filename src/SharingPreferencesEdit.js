import React, { Fragment, useContext, useRef, useState } from 'react';
import { Link, useHistory  } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import SharingPreferencesContext, { keys, options } from './SharingPreferencesContext';
import infoIcon from './info.svg';

const [always, ondemand] = options;

function SharingPreferencesEdit() {

  const { sharingPreferences, setSharingPreferences } = useContext(SharingPreferencesContext);
 
  const [state, setState] = useState(sharingPreferences);

  const active = useRef(true);

  function changeSetting(setting) {
    setState({
      ...state,
      [setting.name]: setting.value,
    });
  }

  function storeSettings(event) {
    event.preventDefault();
  }  

  const refs = keys.reduce((o, k) => {
    o[k] = {
      [always]: React.createRef(),
      [ondemand]: React.createRef(),
    };
    return o;
  }, {});

  return (
    <fieldset>
      <legend>My data can be used for</legend>
      {keys.map(k => (
        <Fragment key={k}>
          <details>
            <summary>
              <span className="view">{k}</span>
              <span className="view icon ml-2">
                <img className="inline" alt="info" src={infoIcon} />
              </span>
            </summary>
            <div className="view">{t(`sharing.tooltip.${k}`)}</div>
          </details>
          {[always, ondemand].map(k2 => (
            <div key={`${k}${k2}`}>
              <input
                type="checkbox"
                id={`${k}-${k2}`}
                className="form-check-input"
                name={`${k}-${k2}`}
                ref={refs[k][k2]}                
                title={t(`sharing.tooltip.${k2}`)}
                defaultChecked={state[k] === k2}
                onChange={(event) => {
                  if (event.target.checked) {
                    // Make sure the other option is de-selected
                    refs[k][k2 === ondemand ? always : ondemand].current.checked = false;
                  }
                  changeSetting({
                    name: k,
                    value: event.target.checked ? k2 : false,
                  });
                }}
              />
              <label
                htmlFor={`${k}-${k2}`}
                className="form-check-label"
                title={t(`sharing.tooltip.${k2}`)}
              >
                {t(`sharing.${k2}`)}
              </label>
            </div>
          ))}
        </Fragment>
      ))}
      <div className="cta">
        <Link
          className="secondary button"
          to="/sharing"
        >
          {t('sharing.cancel')}
        </Link>
        <Link
          className="primary button"
          to="/sharing"
          onClick={storeSettings}
        >
          {t('sharing.save')}
        </Link>
      </div>
    </fieldset>
  );
}

export default SharingPreferencesEdit;
