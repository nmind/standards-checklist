import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Accordion, AccordionDetails, AccordionSummary, Container, List, ListItem, Tooltip, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CheckboxItem } from './Checklist';
import { ProgressCircle, ProgressLabelled } from './ProgressLabelled';

class Tier extends PureComponent {
  static propTypes = {
    tier: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      override: false
    };
    this.prerequisites = this.prerequisites.bind(this);
  }

  onChange = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded, override: true });
  }

  prerequisites = (tier, section) => {
    const { checkDenominator, checkNumerator, tiers } = this.props;
    const { override } = this.state;
    if (!tiers[tier].hasOwnProperty('prerequisiteTiers')) {
      if (!override) {
        this.setState({ expanded: true });
      }
      return null
    } else {
      let expanded = []
      const label = tiers[tier].prerequisiteTiers.map((prereq, index) => {
        const numerator = checkNumerator(prereq, section);
        const denominator = checkDenominator(prereq, section);
        expanded.push(numerator >= denominator);
        return (
          <ProgressLabelled key={ tier + "-" + section + "-prerequisites-" + index.toString() } tier={ prereq } {...{ numerator, denominator }} />
        );
      });
      if (!override && expanded.every(item => item === true)) {
        this.setState({ expanded: true });
      };
      return label;
    }
  }

  tier_section = (tier, section) => {
  };

  render() {
    const { checkDenominator, checkNumerator, checks, handleCheck, items, section, tier, tiers } = this.props;

    const title = Object.keys(tiers).filter(_tier => _tier === tier).map(_tier => {
      return (
        <Container key={tier + "-benefits-tooltip"}>
          <Typography variant="h6">Benefits</Typography>
          <List>
            { tiers[tier].benefits.map(benefit => (
              <ListItem key={tier + "-benefit-" + tiers[tier].benefits.indexOf(benefit)}>{benefit}</ListItem>
            )) }
          </List>
        </Container>
      );
    });

    return (
      <Accordion key={ tier + "=" + section } expanded={ this.state.expanded } onChange={ () => this.onChange() }>
        <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
        <Tooltip key={tier + "-benefits"} title={ title }>
        <Typography variant="h3">{ tier }</Typography>
        </Tooltip>
        <div style={{ position: "relative", left: "5ex" }}>
        <ProgressCircle key={tier + "-progress"} numerator={ checkNumerator(tier, section) } denominator={ checkDenominator(tier, section) } /></div>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            { this.prerequisites(tier, section) }
            { items.filter(item => item.section === section && item.tier === tier).map(item => (
                <CheckboxItem
                  key={ item.prompt }
                  item={ item }
                  checks={ checks }
                  handleCheck={ handleCheck }
                />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default Tier;
