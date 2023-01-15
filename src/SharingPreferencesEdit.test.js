import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider as ReduxProvider } from 'react-redux';

import SharingPreferencesEdit from './SharingPreferencesEdit';
import { SharingPreferencesContextProvider } from './SharingPreferencesContext';
import { defaultStore } from './Contexts';
import configureStore from './configureStore';

const reduxStore = configureStore(defaultStore);

const mockHistory = createMemoryHistory();

// FIRST RUN THE SIMPLE SNAPSHOT TEST //

test('SharingPreferencesEdit snapshot has not changed', () => {
  const tree = renderer
    .create(
      <Router history={mockHistory}>
        <ReduxProvider store={reduxStore}>
          <SharingPreferencesContextProvider>
            <SharingPreferencesEdit />
          </SharingPreferencesContextProvider>
        </ReduxProvider>
      </Router>
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
    <Router history={mockHistory}>
      <ReduxProvider store={reduxStore}>
        <SharingPreferencesContextProvider>
          <SharingPreferencesEdit />
        </SharingPreferencesContextProvider>
      </ReduxProvider>
    </Router>,
    container
  );
  ReactDOM.unmountComponentAtNode(container);
});

it('shallow renders without crashing', () => {
  shallow(
    <Router history={mockHistory}>
      <ReduxProvider store={reduxStore}>
        <SharingPreferencesContextProvider>
          <SharingPreferencesEdit />
        </SharingPreferencesContextProvider>
      </ReduxProvider>
    </Router>
  );
});

describe.skip('wip', () => {
  // TODO(ville): cover changeSetting() and storeSettings() invoked by user actions
  // something wrong with RTL rendering in these test stubs: shows nothing with screen.debug() and skips lines 16 - 106 completely
  it('has right checkbox checked by default', () => {
    <Router history={mockHistory}>
      <ReduxProvider store={reduxStore}>
        <SharingPreferencesContextProvider>
          <SharingPreferencesEdit />
        </SharingPreferencesContextProvider>
      </ReduxProvider>
    </Router>;

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('updates checkbox state when it is clicked on', () => {
    <Router history={mockHistory}>
      <ReduxProvider store={reduxStore}>
        <SharingPreferencesContextProvider>
          <SharingPreferencesEdit />
        </SharingPreferencesContextProvider>
      </ReduxProvider>
    </Router>;

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});
