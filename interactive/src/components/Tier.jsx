import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container, List, ListItem, Tooltip, Typography } from '@mui/material';
import { CheckboxItem } from './Checklist';
import ProgressLabelled from './ProgressLabelled';

class Tier extends PureComponent {
  static propTypes = {
    tier: PropTypes.string.isRequired
  }

  render() {
    const { checkDenominator, checkNumerator, checks, handleCheck, items, section, tier, tiers } = this.props;

    const prerequisites = (tier, section) => {
      if (!tiers[tier].hasOwnProperty('prerequisiteTiers')) {
        return null;
      } else {
        return tiers[tier].prerequisiteTiers.map((prereq, index) => {
          const denominator = checkDenominator(tier, prereq, section);
          return (
            <ProgressLabelled key={ tier + "-" + section + "-prerequisites-" + index.toString() } tier={ prereq } numerator={ checkNumerator(prereq, section) } denominator={ denominator } />
          );
        });
      }
    }

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
      <Container key={tier + '=' + section}>
        <Tooltip key={tier + "-benefits"} title={ title }>
          <Typography variant="h3">{ tier }</Typography>
        </Tooltip>
        <List>
          { prerequisites(tier, section) }
          { items.filter(item => item.section === section && item.tier === tier).map(item => (
              <CheckboxItem
                key={ item.prompt }
                item={ item }
                checks={ checks }
                handleCheck={ handleCheck }
              />
          ))}
        </List>
      </Container>
    );
  }
}

export default Tier;
