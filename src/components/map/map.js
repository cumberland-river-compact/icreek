import L from 'leaflet';
import {
  basemapLayer,
  featureLayer,
  dynamicMapLayer,
  identifyFeatures,
} from 'esri-leaflet';
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

    const streamsUrl =
      'https://services9.arcgis.com/RwTMq0XxCxqj91gL/arcgis/rest/services/iCreek_Streams/FeatureServer/0';
    const catchmentsUrl =
      'https://inlandwaters.geoplatform.gov/arcgis/rest/services/NHDPlus/NHDPlus/MapServer';

    const defaultBasemap = basemapLayer('Imagery', { detectRetina: false });
    this.map = L.map(this.refs.map, {
      center: [36.166, -86.774], // Nashville, TN
      zoom: 15,
      maxZoom: 18, // 18 is max for Esri Imagery
      minZoom: 2,
      layers: [defaultBasemap],
    });

    this.hideIntro = () => {
      // Hide our introductory 'Home Page' message.
      const introStyle = this.refs.intro.style;
      if (introStyle.display !== 'none') {
        introStyle.display = 'none';
      }
    };

    this.showMap = () => {
      // The classList.add() function will ignore classes that already exists
      // in attribute of the element, so we don't need to check for that.
      this.refs.map.classList.add('is-visible');
      // Likewise, the remove() function ignores classes that don't exist.
      this.refs.wrapper.classList.remove('centered');

      // Since the map's footprint has changed, force a Leaflet redraw.
      setTimeout(() => {
        this.map.invalidateSize();
      }, 200);
    };

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
      allowMultipleResults: false,
      zoomToResult: true,
    };
    this.searchControl = geosearch(searchOptions).addTo(this.map);

    // Add an empty layer group to show results on the map.
    this.searchResults = L.layerGroup().addTo(this.map);

    this.searchControl.on('results', data => {
      // We assume 0 or 1 result (allowMultipleResults = false).
      if (data.results && data.results.length > 0) {
        const location = data.results[0];
        this.searchResults.addLayer(L.marker(location.latlng));
        this.hideIntro();
        this.showMap();

        // Clear graphics from any previous search.
        this.searchResults.clearLayers();

        // Find the catchment containing this location.
        identifyFeatures({
          url: catchmentsUrl,
        })
          .on(this.map)
          .at(location.latlng)
          .precision(6)
          .tolerance(1)
          .layers('visible:6')
          .run((error, featureCollection, response) => {
            if (
              featureCollection &&
              featureCollection.features &&
              featureCollection.features.length > 0
            ) {
              // If catchments overlap, then multiple are returned but we only use the first.
              // const catchment = featureCollection.features[0];
              // this.map.fitBounds(catchment.geometry);
            } else {
              throw Error('No catchments found for this search.');
            }
          });
      } else {
        throw Error('No search results found.');
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
