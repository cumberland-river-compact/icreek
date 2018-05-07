import L from 'leaflet';
import { basemapLayer } from 'esri-leaflet';

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

    this.map = L.map(this.refs.mapContainer, {
      center: [36.166, -86.774], // Nashville, TN
      zoom: 12,
      maxZoom: 19, // 19 is max for Esri Topographic
      minZoom: 2,
    });

    this.map.zoomControl.setPosition('bottomright');
    basemapLayer('Topographic').addTo(this.map);

    this.map.invalidateSize();
  }
}
