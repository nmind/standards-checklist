import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import standardChecklist from 'nmind-coding-standards-checklist/checklist.json';
import Tier from './Tier';

class CheckboxItem extends PureComponent {
  static propTypes = {
    checks: PropTypes.object.isRequired,
    handleCheck: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleCheck = this.handleCheck.bind(this);
  }

  checkSubitems(item) {
    const { checks } = this.props;
    return item.hasOwnProperty('items') ? item.items.filter(subitem => {
        return checks[subitem.prompt] === true
      }).length === item.items.length : false;
  }

  checkValue(value) {
    const { checks } = this.props;
    if (checks[value]) {
      return checks[value];
    } else {
      return false;
    }
  }

  handleCheck(event) {
    this.props.handleCheck(event);
  }

  render() {
    const { checks, item } = this.props;
    let parenthetical = '';
    if (item.clarification && item.examples) {
      parenthetical = `(i.e., ${item.clarification}; e.g., ${item.examples.join(', ')})`;
    } else if (item.clarification) {
      parenthetical = `(i.e., ${item.clarification})`;
    } else if (item.examples) {
      parenthetical = `(e.g., ${item.examples.join(', ')})`;
    }
    return (
      item.hasOwnProperty('items') ? <><ListItem key={ item.prompt }>
      <Checkbox 
        name={ item.prompt }
        checked={ this.checkSubitems(item) }
        disabled={ true }
        onChange={ this.handleCheck }
      />
      <ListItemText primary={ item.prompt } secondary={ parenthetical }/>
    </ListItem><ListItem>
        <SubChecklist item={ item } checks={ checks } handleCheck={ this.handleCheck } />
      </ListItem></> : <ListItem key={ item.prompt }>
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
  constructor(props) {
    super(props);

    this.state = {
      checks: {},
      numerator: {}
    };

    this.checkDenominator = this.checkDenominator.bind(this);
    this.checkNumerator = this.checkNumerator.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  checkDenominator(prereq, section) {
    const { items, tiers } = standardChecklist;
    return items.filter(item => item.section === section && item.tier === prereq).length + (tiers.hasOwnProperty(prereq) && tiers[prereq].hasOwnProperty('prerequisiteTiers') ? tiers[prereq].prerequisiteTiers.length : 0)
  }

  checkNumerator(tier, section) {
    const { items, tiers } = standardChecklist;
    const { checks } = this.state;
    let numerator = items.filter(item => item.section === section && item.tier === tier).map(item => item.prompt).filter(item => checks[item] === true).length;
    if (tiers[tier].hasOwnProperty('prerequisiteTiers')) {
      tiers[tier].prerequisiteTiers.forEach(prereq => {
        if (this.checkNumerator(prereq, section) >= this.checkDenominator(prereq, section)) {
          numerator += 1;
        } 
      });
    };
    return numerator;
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
                  <Tier key={ section + '-' + tier } checkDenominator={ this.checkDenominator } checkNumerator={ this.checkNumerator } checks={ this.state.checks } handleCheck={ this.handleCheck } {...{ items, section, tier, tiers }} />
                </div>
               )) }
            </List>
          </Container>
        )) }
      </List>
    );
  }
}

class SubChecklist extends PureComponent {
  static propTypes = {
    checks: PropTypes.object.isRequired,
    handleCheck: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck(event) {
    this.props.handleCheck(event);
  }

  render() {
    const { checks, item } = this.props;
    return (
      <List disablePadding={ true }>
        { item.items.map(subitem => (
            <CheckboxItem
              key={ subitem.prompt }
              item={ subitem }
              checks={ checks }
              handleCheck={ this.handleCheck }
            />
        ))}
      </List>
    )};
}

export { CheckboxItem, Checklist };
