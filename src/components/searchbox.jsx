import React from "react";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: "1rem",
    marginRight: "1rem", //theme.spacing(1), //theme.spacing.unit,
    width: 200,
  },

  cssLabel: {
    color: "green",
  },

  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderWidth: "thin",
      borderColor: `#ffffff !important`,
    },
    height: "2.5rem",
  },

  cssFocused: {
    color: "#f4f4f4 !important",
  },

  notchedOutline: {
    borderWidth: "1px",
    borderColor: "#6C6C6C !important",
    color: "#6C6C6C !important",
    borderRadius: ".75rem !important",
    height: "2.5rem",
  },
}));

function Searchbox(props) {
  const classes = useStyles();

  // const [name, setName] = useState("");

  return (
    <form className={`${classes.container} sb`} noValidate autoComplete="off">
      <TextField
        id="standard-name"
        className={classes.textField}
        variant="outlined"
        placeholder="Search"
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
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: "white" }} />
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </form>
  );
}

export default Searchbox;
