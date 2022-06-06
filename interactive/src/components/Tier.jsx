import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container, List, ListItem, Tooltip, Typography } from '@mui/material';

class Tier extends PureComponent {
  static propTypes = {
    tier: PropTypes.string.isRequired
  }

  render() {
    const { tier, tiers } = this.props;

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
      <Tooltip key={tier + "-benefits-tooltip"} title={ title }>
        <Typography variant="h3">{ tier }</Typography>
      </Tooltip>
    );
  }
}

export default Tier;
