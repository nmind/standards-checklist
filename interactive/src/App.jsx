/* Copyright 2022 NMIND

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://github.com/nmind/standards-checklist/blob/main/LICENSE

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */
import logo from './logo.jsx.svg';
import './nmind.orgExcerpts.css';
import './App.css';
import { Checklist } from './components/Checklist';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a href="https://nmind.org">
          <img src={logo} className="App-logo" alt="logo" />
        </a>
        <p>
          <a href="https://nmind.org">NMIND</a> Coding Standards Checklist
        </p>
      </header>
      <Checklist />
      <Footer />
    </div>
  );
}

export default App;
