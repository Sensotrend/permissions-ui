import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';

import SharingPreferencesSummary from './SharingPreferencesSummary';
import { SharingPreferencesContextProvider } from './SharingPreferencesContext';

// FIRST RUN THE SIMPLE SNAPSHOT TEST //

test('SharingPreferencesSummary snapshot has not changed', () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <SharingPreferencesContextProvider>
          <SharingPreferencesSummary />
        </SharingPreferencesContextProvider>
      </BrowserRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

// THEN THE MORE COMPLICATED UNIT TESTS //

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('react renders without crashing', () => {
  ReactDOM.render(
    <BrowserRouter>
      <SharingPreferencesContextProvider>
        <SharingPreferencesSummary />
      </SharingPreferencesContextProvider>
    </BrowserRouter>,
    container
  );
  ReactDOM.unmountComponentAtNode(container);
});

it('shallow renders without crashing', () => {
  shallow(
    <BrowserRouter>
      <SharingPreferencesContextProvider>
        <SharingPreferencesSummary />
      </SharingPreferencesContextProvider>
    </BrowserRouter>
  );
});

describe.skip('wip', () => {
  // TODO(ville): more complex test cases
});
