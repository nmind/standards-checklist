import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Box, Checkbox, CircularProgress, ListItem, ListItemText, Typography } from '@mui/material';

class ProgressLabelled extends PureComponent {
  static propTypes = {
    denominator: PropTypes.number.isRequired,
    numerator: PropTypes.number.isRequired,
    tier: PropTypes.string.isRequired
  }

  render() {
    const { denominator, numerator, tier } = this.props;

    return (
      <ListItem key={ tier + "-prerequisite" }>
        <Checkbox 
          name={ tier + " for prerequisite" }
          checked={ numerator >= denominator }
          disabled={ true }
        />
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress variant="determinate" value={ (numerator / denominator) * 100 } />
          <Box sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Typography><sup>{ numerator }</sup>/<sub>{ denominator }</sub></Typography>
          </Box>
        </Box><ListItemText primary={ "All items from " + tier + " tier" } />
      </ListItem>
    );
  }
}

export default ProgressLabelled;
