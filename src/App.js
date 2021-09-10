import React, {useEffect, useState} from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import {getPlacesData} from './api/index'

function App() {

  const [places, setPlaces] = useState([])
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [coordinates, setCoordinates] = useState({})
  const [bounds, setBounds] = useState(null)
  const [childClicked, setChildClicked] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [type, setType] = useState('hotels')
  const [rating, setRating] = useState('all')
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
      setCoordinates({lat: latitude, lng: longitude})
    })
  }, [])

  useEffect(() => {
    if(bounds) {
      setIsLoading(true)  
      getPlacesData(type, bounds?.sw, bounds?.ne)
      .then((data) => {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0))
        setFilteredPlaces([])
        setIsLoading(false)
      })
    }
    
  }, [type, bounds])

  useEffect(() => {
    const filteredPlaces = places.filter((place) => Number(place.rating) > rating)
    setFilteredPlaces(filteredPlaces)
  }, [rating])

  const onLoad = (autoC) => setAutocomplete(autoC)
  
  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();
  }

  return (
    <>
     <CssBaseline />
     <Header onLoad={onLoad} onPlaceChanged={onPlaceChanged} />
     <Grid container spacing={3} style={{width: '100%'}}>
        <Grid item xs={12} md={4}>
          <List 
            places={filteredPlaces.length ? filteredPlaces :  places} 
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map 
            setCoordinates={setCoordinates} 
            setBounds={setBounds} 
            coordinates={coordinates} 
            places={filteredPlaces.length ? filteredPlaces :  places}
            setChildClicked={setChildClicked}
          />
        </Grid>
     </Grid>
    </>
  );
}

export default App;
