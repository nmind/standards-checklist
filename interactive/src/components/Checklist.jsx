import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import standardChecklist from 'nmind-coding-standards-checklist/checklist.json';
import Tier from './Tier';

class CheckboxItem extends PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      checks: {}
    };

    this.handleCheck = this.handleCheck.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  checkValue(value) {
    if (this.state.checks[value]) {
      return this.state.checks[value];
    } else {
      return false;
    }
  }

  handleCheck(event) {
    const { name, checked } = event.target;
    const newCheck = {};
    newCheck[name] = checked;
    this.setState((state, props) => ({
      checks: {
        ...this.state.checks,
        ...newCheck}
    }))
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
      <ListItem key={ item.prompt }>
        <Checkbox 
          name={ item.prompt }
          checked={ this.checkValue(item.prompt) }
          disabled={ false }
          onChange={ this.handleCheck }
        />
        <ListItemText primary={ item.prompt } secondary={ parenthetical }/>
      </ListItem>
    );
  }
}

class Checklist extends PureComponent {
  render() {
    const { items, tiers } = standardChecklist;
    const sections = [...new Set(items.filter(item => item.section).map(item => item.section))];

    return (
      <List disablePadding={ true }>
        { sections.map(section => (
          <Container key={section}>
            <Typography variant="h2">{ section }</Typography>
            <List disablePadding={ true }>
              { Object.keys(tiers).map(tier => (
                  <div key={ section + '-' + tier + '-div' }>
                  <Tier key={ section + '-' + tier } tier={ tier } />
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
          </Container>
        )) }
      </List>
    );
  }
}

export default Checklist;
