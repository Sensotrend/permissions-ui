import Permissions from './Permissions';
import { ProcessorsContextProvider } from './ProcessorsContext';

function App() {
  return (
    <ProcessorsContextProvider>
      <Permissions />
    </ProcessorsContextProvider>
  );
}

export default App;
