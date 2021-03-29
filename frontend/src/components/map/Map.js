import React, { useState, useEffect } from "react";

// react-map-gl is a wrapper around mapbox js library, which is more react-friendly.
import ReactMapGL, { Marker, Popup, FlyToInterpolator } from "react-map-gl";
import { easeCubic } from "d3-ease";

function distance(lat1, lon1, lat2, lon2, unit = "M") {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    let radlat1 = (Math.PI * lat1) / 180;
    let radlat2 = (Math.PI * lat2) / 180;
    let theta = lon1 - lon2;
    let radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "M") {
      dist = (dist * 1.609344) / 1000;
    }
    return dist;
  }
}

export default function Map() {
  // State Description:
  //   - moveDistance: the moving amount of viewport center compared to last frame
  //   - viewport: dictionary containing map viewport setting
  //   - selectedCamera: an object containing user selected camera
  //   - visibleCameras: a list of objects containing visible cameras in current viewport
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    width: "100%",
    height: "100%",
    zoom: 0,
  });
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [visibleCameras, setVisibleCameras] = useState([]);

  // Life cycle management
  // - componentDidMount:
  //     1. Get geo-position of current device
  //     2. Fetch visible cameras related to current viewport
  //     3. Setup interval camera update function
  // - componentDidUpdate:
  //     1. Fetch visible cameras realted to current viewport
  //     2. Setup interval camera update function
  // - componentWillUmount:
  //     1. Cleanup update interval function
  let updateTimer = null;
  function initViewport(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    setViewport({
      ...viewport,
      latitude: latitude,
      longitude: longitude,
      transitionDuration: 3000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: easeCubic,
      zoom: 15,
    });
  }
  function getVisibleCameras() {
    return;
    const queryString =
      "?latitude=" + viewport.latitude + "&longitude=" + viewport.longitude;
    fetch("/api/camera/visible" + queryString)
      .then((response) => response.json())
      .then((cameras) => {
        setVisibleCameras(cameras);
      });
  }
  function updateViewport(newViewport) {
    const lat1 = viewport.latitude;
    const lon1 = viewport.longitude;
    const lat2 = newViewport.latitude;
    const lon2 = newViewport.longitude;
    const dist = distance(lat1, lon1, lat2, lon2);
    setViewport({ ...newViewport, width: "fit", height: "fit" });
    if (dist >= 100) {
      getVisibleCameras();
    }
  }
  function logError(e) {
    console.log(e);
  }
  useEffect(() => {
    // componentDidMount
    if (viewport.latitude === 0 && viewport.longitude === 0 && !updateTimer) {
      navigator.geolocation.getCurrentPosition(initViewport, logError);
      console.log("update timer");
      updateTimer = setInterval(() => {
        getVisibleCameras();
      }, 500);
    }
    return function cleanup() {
      console.log("cleanup timer");
      clearInterval(updateTimer);
      updateTimer = null;
    };
  }, []);

  // Map display
  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken="pk.eyJ1Ijoiam9obm55bG9yZCIsImEiOiJja21zcng0NWwwaDRvMndvNTYwN2w4NnBpIn0.D5Xe_RcIHE5-Mfp9-QXcZw"
      onViewportChange={updateViewport}
      mapStyle="mapbox://styles/johnnylord/ckmssit732xsr17lgg3ddhpwe"
    >
      {/* All visible cameras will be showned here */}
      {}
    </ReactMapGL>
  );
}
