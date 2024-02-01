import { MaterialLayoutRenderer } from '@jsonforms/material-renderers';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Hidden,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { rankWith, uiTypeIs } from '@jsonforms/core';
import { Shield, SHIELD_FILL, SHIELD_STROKE } from './components/Shield';
import { dictAllTrue, dictFractionTrueString } from './utils';

const MyGroupRenderer = (props) => {
  const { uischema, schema, path, visible, renderers, data } = props;

  const layoutProps = {
    elements: uischema.elements,
    schema: schema,
    path: path,
    direction: 'column',
    visible: visible,
    uischema: uischema,
    renderers: renderers,
  };
  let x = undefined;
  if (['Bronze', 'Silver', 'Gold'].includes(uischema.label)) {
    x = <Shield
      style={{ width: "42px", fontSize: "0.48em", fontWeight: "625" }}
      fill={SHIELD_FILL[uischema.label.toLowerCase()]}
      stroke={dictAllTrue(data) ? SHIELD_STROKE.success : SHIELD_STROKE.fail}
      text={dictFractionTrueString(data)}
    />
  }

  return (
    <Hidden xsUp={!visible}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {x} <Typography style={{ paddingTop: "10px", paddingLeft: "10px" }}>{uischema.label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MaterialLayoutRenderer {...layoutProps} />
        </AccordionDetails>
      </Accordion>
    </Hidden>
  );
};

export default withJsonFormsLayoutProps(MyGroupRenderer);


export const CustomGroupTester = rankWith(1000, uiTypeIs('Group'));