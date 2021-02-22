import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { 
    Button, 
    Container,
    Paper,
    Grid
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

const Main = props => {
    const [state, setState] = useState("Hello World");
    return <ThemeProvider theme={theme}>
            <Container maxWidth="xs">
                <Grid container justify="center">
                <Grid item>
                    <Paper>
                        Hello
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper>
                        Hello
                    </Paper>
                </Grid>
                </Grid>
                <Box component="span" m={1}>
                    <Button 
                    size="large"
                    variant="contained" 
                    color="primary">Hello World</Button>
                </Box>
            </Container>
        </ThemeProvider> ;

};

Main.propTypes = {};

export { Main };