import logo from './logo.svg';
import './nmind.orgExcerpts.css';
import './App.css';
import Checklist from './components/Checklist';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a href="https://nmind.org">
          <img src={logo} className="App-logo" alt="logo" />
        </a>
        <p>
          <a href="https://nmind.org">NMiND</a> Coding Standards Checklist
        </p>
      </header>
      <Checklist />
      <Footer />
    </div>
  );
}

export default App;
