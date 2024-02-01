import { rankWith, isBooleanControl, ControlProps } from '@jsonforms/core';
import { MuiCheckbox } from '@jsonforms/material-renderers';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { FormControlLabel } from '@mui/material';

const CustomCheckboxRenderer = (props: ControlProps) => {
  const {
    data,
    visible,
    label,
    id,
    enabled,
    uischema,
    schema,
    rootSchema,
    handleChange,
    errors,
    path,
    config,
    description,
  } = props;

  return (
    <div>
      <FormControlLabel
        label={
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <span style={{ display: 'block' }}>{label}</span>
            <span style={{ display: 'block', color: 'gray' }}>{description}</span>
          </div>
        }
        id={id}
        control={
          <MuiCheckbox
            id={`${id}-input`}
            isValid={errors.length === 0}
            data={data}
            enabled={enabled}
            visible={visible}
            path={path}
            uischema={uischema}
            schema={schema}
            rootSchema={rootSchema}
            handleChange={handleChange}
            errors={errors}
            config={config}
          />
        }
      />
    </div>
  );
};

const CustomCheckboxControlTester = rankWith(1000, isBooleanControl);

export default withJsonFormsControlProps(CustomCheckboxRenderer);

export { CustomCheckboxControlTester };