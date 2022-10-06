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
import { PureComponent } from 'react';
import { dom } from '@fortawesome/fontawesome-svg-core'
import yaml from 'js-yaml';

const loadMainSiteConfig = async (configUrl) => {
  const r = await fetch(configUrl);
  const str = await r.text();
  return yaml.load(str);
}

const getFooter = async (configUrl) => {
  const config = await loadMainSiteConfig(configUrl);
  return config.footer;
}

export default class Footer extends PureComponent {
  constructor() {
    super();
    this.state = { footer: {} };
  }
  
  componentDidMount() {
    const siteConfigUrl = "https://raw.githubusercontent.com/nmind/nmind.github.io/main/_config.yml";
    getFooter(siteConfigUrl).then(footerConfig => {
      this.setState({ footer: footerConfig });
    });
  }

  render() {
    const { footer } = this.state;
    const footerLinks = footer.hasOwnProperty('links') ? footer.links : [];
    dom.watch();
    return (
    <div id="footer" className="page__footer"><footer>
      <div className="page__footer-follow">
        <ul className="social-icons">
          <li><strong>Follow:</strong></li>
          { footerLinks.map(link => {
              return (
                <li key={link.label}>
                  <a href={link.url} rel="nofollow noopener noreferrer"><i className={link.icon}></i> {link.label}</a>
                </li>
              );
            })
          }
        </ul>
      </div>
      <div className="page__footer-copyright">&copy; 2022 NMIND. Licensed under <a href="https://github.com/nmind/standards-checklist/blob/main/LICENSE">Apache-2.0</a>. Powered by <a href="https://reactjs.org/" rel="nofollow">React</a>.</div>
    </footer></div>
    );
  }
}
