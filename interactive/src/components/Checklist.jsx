import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import standardChecklist from 'nmind-coding-standards-checklist/checklist.json';

class CheckboxItem extends PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
  }

  render() {
    const { item } = this.props;
    let parenthetical = '';
    if (item.clarification && item.examples) {
      parenthetical = `(i.e., ${item.clarification}; e.g., ${item.examples.join(', ')})`;
    } else if (item.clarification) {
      parenthetical = `(i.e., ${item.clarification})`;
    } else if (item.examples) {
      parenthetical = `(e.g., ${item.examples.join(', ')})`;
    }
    return (
      <ListItem>
        <Checkbox 
          name={ item.label }
          checked={ false }
          disabled={ false }
        />
        <ListItemText primary={ item.prompt } secondary={ parenthetical }/>
      </ListItem>
    );
  }
}

class Checklist extends PureComponent {
  render() {
    const { items } = standardChecklist;
    const tiers = [...new Set(items.filter(item => item.tier).map(item => item.tier))];
    const sections = [...new Set(items.filter(item => item.section).map(item => item.section))];

    return (
      <List disablePadding={ true }>
        { sections.map(section => (
          <div>
            <h2>{ section }</h2>
            <List disablePadding={ true }>
              { tiers.map(tier => (
                  <div>
                  <h3>{ tier }</h3>
                  <List>
                    { items.filter(item => item.section === section && item.tier === tier).map(item => (
                        <CheckboxItem
                          key={ item.prompt }
                          item={ item }
                        />
                    ))}
                  </List>
                </div>
               )) }
            </List>
          </div>
        )) }
      </List>
    );
  }
}

export default Checklist;
