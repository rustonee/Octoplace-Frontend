import React from "react";
import PropTypes from "prop-types";
// import { withStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";

const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },

  cssLabel: {
    color: "green",
  },

  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: `${theme.palette.primary.main} !important`,
    },

    backgroundColor: "white",
    borderRadius: "25px !important",
    color: "black",
    height: "35px",
  },

  cssFocused: {},

  notchedOutline: {
    borderWidth: "1px",
    borderColor: "white !important",
    color: "black !important",
    borderRadius: "25px !important",
    lineHeight: "1em",
    height: "35px",
  },
});

class TextBox extends React.Component {
  state = {
    name: "",
  };

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes, placeholder } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          fullWidth
          id="standard-name"
          className={classes.textField}
          value={this.state.name}
          onChange={this.handleChange("name")}
          variant="outlined"
          placeholder={placeholder}
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            },
          }}
        />
      </form>
    );
  }
}

TextBox.propTypes = {
  classes: PropTypes.object.isRequired,
};

// export default withStyles(styles)(TextBox);
