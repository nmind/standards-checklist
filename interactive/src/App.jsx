import logo from './logo.svg';
import './App.css';
import Checklist from './components/Checklist';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          NMiND Coding Standards Checklist
        </p>
      </header>
      <Checklist />
    </div>
  );
}

export default App;
