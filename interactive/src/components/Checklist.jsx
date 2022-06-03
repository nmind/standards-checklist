import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import standardChecklist from 'nmind-coding-standards-checklist/checklist.json';
import ProgressLabelled from './ProgressLabelled';
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

    this.handleCheck = this.handleCheck.bind(this);
  }

  checkNumerator(tier, section) {
    const { items } = standardChecklist;
    const { checks } = this.state;
    const numerator = items.filter(item => item.section === section && item.tier === tier).map(item => item.prompt).filter(item => checks[item] === true).length;
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

    const prerequisites = (tier, section) => {
      if (!tiers[tier].hasOwnProperty('prerequisiteTiers')) {
        return null;
      } else {
        return tiers[tier].prerequisiteTiers.map((prereq, index) => {
          const denominator = items.filter(item => item.section === section && item.tier === prereq).length;
          return (
            <ProgressLabelled key={ tier + "-" + section + "-prerequisites-" + index.toString() } tier={ prereq } numerator={ this.checkNumerator(prereq, section) } denominator={ denominator } />
          );
        });
      }
    }

    return (
      <List disablePadding={ true }>
        { sections.map(section => (
          <Container key={section}>
            <Typography variant="h2">{ section }</Typography>
            <List disablePadding={ true }>
              { Object.keys(tiers).map(tier => (
                  <div key={ section + '-' + tier + '-div' }>
                  <Tier key={ section + '-' + tier } tier={ tier } section={ section } />
                  <List>
                    { prerequisites(tier, section) }
                    { items.filter(item => item.section === section && item.tier === tier).map(item => (
                        <CheckboxItem
                          key={ item.prompt }
                          item={ item }
                          checks={ this.state.checks }
                          handleCheck={ this.handleCheck }
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

export default Checklist;
