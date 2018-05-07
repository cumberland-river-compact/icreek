import L from 'leaflet';
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
      maxZoom: 18, // 18 is max for OSM
      minZoom: 2,
    });

    this.map.zoomControl.setPosition('bottomright');

    // Render OSM basemap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.invalidateSize();
  }
}
