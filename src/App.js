import Permissions from './Permissions';
import { PermissionsContextProvider } from './PermissionsContext';

function App() {
  return (
    <PermissionsContextProvider>
      <Permissions />
    </PermissionsContextProvider>
  );
}

export default App;
