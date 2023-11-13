import React from 'react';
import { Switch } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    width: '50px',
    height: '24px',
    padding: '0px'
  },
  thumb: {
    color: 'white',
    width: '20px',
    height: '20px',
    margin: '1px'
  },
  track: {
    borderRadius: '20px',
    '&:after, &:before': {
      color: 'white',
      fontSize: '11px',
      position: 'absolute',
      top: '6px'
    },
    '&:after': {
      content: (props: any) => `${props.checkedLabel}`,
      left: '8px'
    },
    '&:before': {
      content: (props: any) =>`${props.unCheckedLabel}`,
      right: '7px'
    }
  },
  checked: {
    transform: 'translateX(26px) !important'
  }
});

export interface SwitchesProps {
  checkedLabel: string;
  unCheckedLabel: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export default function Switches(props: SwitchesProps) {
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    checkedA: props.checked
  });

  const handleChange = (event: any) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    props.onChange(event.target.checked);
  };

  return (
    <div>
      <Switch
        classes={{
          root: classes.root,
          track: classes.track,
        }}
        checked={state.checkedA}
        onChange={handleChange}
        name="checkedA"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
    </div>
  );
}
