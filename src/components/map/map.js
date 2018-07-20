import L from 'leaflet';
import { basemapLayer, featureLayer } from 'esri-leaflet';

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
    this.map = L.map(this.refs.mapContainer, {
      center: [36.166, -86.774], // Nashville, TN
      zoom: 14,
      maxZoom: 18, // 18 is max for Esri Imagery
      minZoom: 2,
      layers: [defaultBasemap],
    });

    this.map.zoomControl.setPosition('bottomright');

    const layers = {
      'Imagery Map': defaultBasemap,
      'Topo Map': basemapLayer('Topographic'),
      'Streets Map': basemapLayer('Streets'),
    };

    L.control.layers(layers).addTo(this.map);

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
      return { color: c, opacity: 0.9, weight: 5 };
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
      return { color: c, opacity: 0.9, weight: 5 };
    };

    const streams = featureLayer({
      url: streamsUrl,
      // Keep minZoom at around 13.
      // Zooming out grabs too much data and eats Esri service credits.
      minZoom: 13,
      style: getDefaultStreamsStyle,
    }).addTo(this.map);

    // Stream colors must be adjusted for dark vs light basemaps.
    this.map.on(
      'baselayerchange',
      // Do not switch to an arrow function because we want to bind
      // streams as the context.
      function changeStyle(layersControlEvent) {
        switch (layersControlEvent.name) {
          case 'Imagery Map':
            this.setStyle(getDefaultStreamsStyle);
            break;
          case 'Topo Map':
            this.setStyle(getAltStreamsStyle);
            break;
          case 'Streets Map':
            this.setStyle(getAltStreamsStyle);
            break;
          default:
            this.setStyle(getDefaultStreamsStyle);
        }
      },
      streams
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
