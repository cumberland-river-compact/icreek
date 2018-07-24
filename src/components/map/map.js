import L from 'leaflet';
import { basemapLayer, featureLayer, dynamicMapLayer } from 'esri-leaflet';
import { geosearch } from 'esri-leaflet-geocoder';

import './map.scss';
import template from './map.html';
import Component from '../component';

/**
 * Leaflet Map Component
 * @extends Component
 */
export default class Map extends Component {
  /**
   * Map Component Constructor
   * @param { String } mapPlaceholderId - Id for the DOM element which will hold the map
   * @param { Object } props.events.click Map item click listener
   * @param { String } template - HTML template for the component
   */
  constructor(mapPlaceholderId, props) {
    super(mapPlaceholderId, props, template);

    const defaultBasemap = basemapLayer('Imagery', { detectRetina: false });
    this.map = L.map(this.refs.map, {
      center: [36.166, -86.774], // Nashville, TN
      zoom: 15,
      maxZoom: 18, // 18 is max for Esri Imagery
      minZoom: 2,
      layers: [defaultBasemap],
    });

    // Add the geocoder search textbox.
    // Restrict results to an approx. bounding box of Cumberland River Basin.
    const southWest = L.latLng(34.77771, -90.50537);
    const northEast = L.latLng(37.97884, -81.40869);
    const basinArea = L.latLngBounds(southWest, northEast);
    const searchOptions = {
      placeholder: 'Search within the River Basin',
      collapseAfterResult: false,
      useMapBounds: false,
      searchBounds: basinArea,
    };
    this.searchControl = geosearch(searchOptions).addTo(this.map);

    // Add an empty layer group to show results on the map.
    this.searchResults = L.layerGroup().addTo(this.map);

    // Listen for results and add every result to the map.
    this.searchControl.on('results', data => {
      this.refs.intro.style.display = 'none';
      this.refs.map.classList.add('is-visible');
      this.refs.wrapper.classList.remove('centered');
      // TODO: is 200ms a good delay for slow devices?
      setTimeout(() => {
        this.map.invalidateSize();
      }, 200);
      this.searchResults.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
        this.searchResults.addLayer(L.marker(data.results[i].latlng));
      }
    });

    this.map.zoomControl.setPosition('bottomright');

    const layers = {
      Imagery: defaultBasemap,
      // While Esri has a 'Streets' basemap, their 'Topographic' map has
      // cleaner line work and also includes streets. Calling it 'Streets'
      // instead of 'Topo' might be technically wrong, but should make
      // more sense for a majority of users.
      Streets: basemapLayer('Topographic'),
    };

    this.map.layersControl = L.control.layers(layers).addTo(this.map);
    this.map.layersControl.setPosition('bottomleft');

    const streamsUrl =
      'https://services9.arcgis.com/RwTMq0XxCxqj91gL/arcgis/rest/services/iCreek_Streams/FeatureServer/0';

    const getDefaultStreamsStyle = feature => {
      let c;
      switch (feature.properties.Status) {
        case 'Healthy':
          c = '#03a9f4';
          break;
        case 'Unhealthy':
          c = '#c51162';
          break;
        case 'Unassessed':
          c = '#ffc766';
          break;
        default:
          c = '#bdbdbd';
      }
      return { color: c, opacity: 0.9, weight: 4 };
    };

    const getAltStreamsStyle = feature => {
      let c;
      switch (feature.properties.Status) {
        case 'Healthy':
          c = '#03a9f4';
          break;
        case 'Unhealthy':
          c = '#c51162';
          break;
        case 'Unassessed':
          c = '#ffa000';
          break;
        default:
          c = '#757575';
      }
      return { color: c, opacity: 0.9, weight: 4 };
    };

    const streams = featureLayer({
      url: streamsUrl,
      // Keep minZoom at around 12.
      // Zooming out grabs too much data and eats Esri service credits.
      minZoom: 12,
      style: getDefaultStreamsStyle,
    }).addTo(this.map);

    const catchmentsUrl =
      'https://inlandwaters.geoplatform.gov/arcgis/rest/services/NHDPlus/NHDPlus/MapServer';

    const catchments = dynamicMapLayer({
      url: catchmentsUrl,
      minZoom: 12,
      opacity: 0.4,
      dynamicLayers: [
        {
          id: 6,
          name: 'Catchment',
          source: { type: 'mapLayer', mapLayerId: 6 },
          drawingInfo: {
            renderer: {
              type: 'simple',
              label: '',
              description: '',
              symbol: {
                color: null,
                outline: {
                  color: [0, 0, 0, 255],
                  width: 8,
                  type: 'esriSLS',
                  style: 'esriSLSSolid',
                },
                type: 'esriSFS',
                style: 'esriSFSSolid',
              },
            },
          },
          minScale: 288896,
          maxScale: 0,
          definitionExpression: "NHDPLUS_REGION='05'",
        },
      ],
      layers: [6],
    }).addTo(this.map);

    // Stream colors must be adjusted for dark vs light basemaps.
    this.map.on(
      'baselayerchange',
      // Do not switch to an arrow function because we want to bind
      // streams as the context.
      function changeStyle(layersControlEvent) {
        switch (layersControlEvent.name) {
          case 'Imagery':
            this.streams.setStyle(getDefaultStreamsStyle);
            this.catchments.setOpacity(0.4);
            break;
          case 'Streets':
            this.streams.setStyle(getAltStreamsStyle);
            this.catchments.setOpacity(0.15);
            break;
          default:
            throw Error(`Basemap '${layersControlEvent.name}' not recognized`);
        }
      },
      { streams, catchments }
    );

    streams.bindPopup(layer =>
      L.Util.template(
        '<p><strong>{Name}</strong></p><p>{Status}</p>',
        layer.feature.properties
      )
    );

    // With 6x CPU throttling from Chrome DevTools, at least 250ms is needed
    // for our map to be placed and styled; invalidateSize must wait to detect
    // the map's final size.
    setTimeout(() => {
      this.map.invalidateSize(true);
    }, 350);
  }
}
