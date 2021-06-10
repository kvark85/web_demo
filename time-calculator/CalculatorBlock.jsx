'use strict';

const {
  Typography,
  Container,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  makeStyles,
} = MaterialUI;

const useCalculatorBlocStyles = makeStyles(theme => ({
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
}));

function CalculatorBlock() {
  const classes = useCalculatorBlocStyles();
  return (
    <Container maxWidth="md" component="main">
      <Card>
        <CardHeader
          title="Text 1"
          subheader="Text 2"
          titleTypographyProps={{align: 'center'}}
          subheaderTypographyProps={{align: 'center'}}
          className={classes.cardHeader}
        />
        <CardContent>
          <div className={classes.cardPricing}>
            Text 3
          </div>
          <ul>
            <Typography component="li" variant="subtitle1" align="center">
              Text 4
            </Typography>
            <Typography component="li" variant="subtitle1" align="center">
              Text 5
            </Typography>
          </ul>
        </CardContent>
        <CardActions>
          <Button fullWidth variant="outlined" color="primary">
            Button
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
