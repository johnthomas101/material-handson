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

import CustomEditor from '../CustomEditor/CustomEditor';

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
    const [markup, setMarkup] = useState("Nothing here yet");
    const [markupObj, setMarkupObj] = useState(null);

    const outerEditorAction = (obj, text) => {
      setMarkup(obj.html);
      setMarkupObj(obj.obj);
      console.log(obj);
    }  

    return <ThemeProvider theme={theme}>
            <Container maxWidth="xs">
                <Grid container justify="center">
                <Grid item>
                    <Paper>
                        Draft JS POC
                    </Paper>
                </Grid>

                <Grid item>
                    <Paper>
                      <CustomEditor 
                      readOnly={false}
                      outerAction={outerEditorAction}/>
                    </Paper>
                </Grid>

                {/* <Grid item>
                    <Paper>
                      <CustomEditor 
                      readOnly={true}
                      // outerAction={outerEditorAction}
                      detailsObj={markupObj}/>
                    </Paper>
                </Grid> */}
                </Grid>
                <Box component="span" m={1}>
                <div
                dangerouslySetInnerHTML={{
                  __html: markup
                }}></div>
                </Box>
            </Container>
        </ThemeProvider> ;

};

Main.propTypes = {};

export { Main };