import React, { useEffect, useState } from 'react'
import './App.css';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core'
import InfoBox from './InfoBox'
import Map from './Map';
import Table from './Table'
import { sortData, prettyPrintStat } from './util'
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data)
    })
  }, [])

  // API request
  useEffect(() => {
    //asynch -> send a request, wait for it and use the info
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2,
          }
        ))
        const sortedData = sortData(data)
        setTableData(sortedData)
        setCountries(countries)
        setMapCountries(data)
      })
    }
    getCountriesData()
    
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    setCountry(countryCode)
    const url = countryCode === 'worlwide' 
      ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`

      await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode)
        setCountryInfo(data)

        if(countryCode === 'worldwide') {
          setMapCenter({ lat: 34.80746, lng: -40.4796 })
          setMapZoom(4)
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long])
          setMapZoom(4)
        }
      })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country, i) => (
                  <MenuItem key={i} value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>  
          </FormControl>
        </div>

        <div className="app__stats">
              <InfoBox 
                active={casesType === 'cases'}
                onClick={() => setCasesType('cases')}
                title="Coronavirus cases" 
                isRed
                cases={prettyPrintStat(countryInfo.todayCases)} 
                total={prettyPrintStat(countryInfo.cases)}
              />
              <InfoBox 
                active={casesType === 'recovered'}
                onClick={() => setCasesType('recovered')}
                title="Recovered" 
                isRed={false}
                cases={prettyPrintStat(countryInfo.todayRecovered)} 
                total={prettyPrintStat(countryInfo.recovered)}
              />
              <InfoBox 
                active={casesType === 'deaths'}
                onClick={() => setCasesType('deaths')}
                title="Deaths" 
                isRed
                cases={prettyPrintStat(countryInfo.todayDeaths)} 
                total={prettyPrintStat(countryInfo.deaths)}
              />
        </div>

        <Map  countries={mapCountries} center={mapCenter} zoom={mapZoom} casesType={casesType}/>
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
