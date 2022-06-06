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
      <div className="page__footer-copyright">&copy; 2022 NMIND. Powered by <a href="https://reactjs.org/" rel="nofollow">React</a>.</div>
    </footer></div>
    );
  }
}
