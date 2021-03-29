import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Map from "../components/map/Map";

const useStyles = makeStyles((theme) => ({
  fit: {
    width: "100%",
    height: "100%",
  },
  fitWidth: { width: "100%" },
  fitHeight: { height: "100%" },
  display: {
    width: "100%",
    height: "92%",
  },
  toolbar: {
    width: "100%",
    height: "8%",
  },
}));

export default function HomePage() {
  const classes = useStyles();

  // Define HomePage Layout Here
  return (
    <div className={classes.fit}>
      {/* Display container */}
      <Grid className={classes.display} container spacing={0}>
        <Grid className={classes.fitHeight} item xs={3}>
          Info Card List
        </Grid>
        <Grid className={classes.fitHeight} item xs={9}>
          <Map></Map>
        </Grid>
      </Grid>
      {/* Toolbar container */}
      <Grid
        className={classes.toolbar}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <BottomNavigation showLabels>
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
          </BottomNavigation>
        </Grid>
      </Grid>
    </div>
  );
}
