import { PureComponent, React } from 'react';
import PropTypes from 'prop-types';
import { Accordion, AccordionDetails, AccordionSummary, Container, List, ListItem, Tooltip, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CheckboxItem } from './Checklist';
import { ProgressCircle, ProgressLabelled } from './ProgressLabelled';

class Tier extends PureComponent {
  static propTypes = {
    checkDenominator: PropTypes.func.isRequired,
    checkNumerator: PropTypes.func.isRequired,
    checks: PropTypes.object.isRequired,
    handleCheck: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    overrides: PropTypes.array.isRequired,
    section: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    tiers: PropTypes.array.isRequired,
    toggleTier: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { tier, tiers } = this.props;
    this.prerequisites = this.prerequisites.bind(this);
    this.toggleTier = this.toggleTier.bind(this);
    this.state = {
      expanded: !Object.prototype.hasOwnProperty.call(tiers[tier], 'prerequisiteTiers'),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { checkDenominator, checkNumerator, overrides, section, tier, tiers, toggleTier } = props;
    const { expanded } = state;
    const override = overrides.includes(`${tier}-${section}`);
    const allChecked = checkNumerator(tier, section) >= checkDenominator(tier, section);
    let nowExpanded = expanded;
    if (Object.prototype.hasOwnProperty.call(tiers[tier], 'prerequisiteTiers')) {
      let prereqs = [];
        tiers[tier].prerequisiteTiers.forEach(prereq => {
          const numerator = checkNumerator(prereq, section);
          const denominator = checkDenominator(prereq, section);
          prereqs.push(numerator >= denominator);
        });
      if (prereqs.every(item => item === true)) {
        // expand when all prerequisites are met
        nowExpanded = !allChecked;
      }
    } else if (!allChecked) {
      nowExpanded = true;
    } else if (allChecked) {
      nowExpanded = false;
    }
    if (override) {
      if (nowExpanded === expanded ) {
        // turn off override if it matches the automatic state
        toggleTier(null, tier, section);
      } else {
        return state;
      }
    }
    return {expanded: nowExpanded};
  }

  toggleTier(event, tier, section) {
    this.setState({ expanded: !this.state.expanded });
    this.props.toggleTier(event, tier, section);
  }

  prerequisites = (tier, section) => {
    const { checkDenominator, checkNumerator, tiers } = this.props;
    if (!Object.prototype.hasOwnProperty.call(tiers[tier], 'prerequisiteTiers')) {
      return null
    } else {
      let expanded = [];
      const label = tiers[tier].prerequisiteTiers.map((prereq, index) => {
        const numerator = checkNumerator(prereq, section);
        const denominator = checkDenominator(prereq, section);
        expanded.push(numerator >= denominator);
        return (
          <ProgressLabelled key={ tier + "-" + section + "-prerequisites-" + index.toString() } tier={ prereq } { ...{numerator, denominator} } />
        );
      });
      return label;
    }
  }

  render() {
    const { checkDenominator, checkNumerator, checks, handleCheck, items, section, tier, tiers } = this.props;
    const { toggleTier } = this;
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
      <Accordion key={ tier + "-" + section } expanded={ this.state.expanded } onChange={ event => toggleTier(event, tier, section) }>
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
