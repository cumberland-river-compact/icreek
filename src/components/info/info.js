import './info.scss';
import template from './info.html';
import Component from '../component';

/**
 * Info Component
 * @extends Component
 */
export default class Info extends Component {
  /**
   * Info Component Constructor
   * @param { String } infoPlaceholderId - Id for the DOM element which will hold the content
   * @param { Object } props.events.click Info item click listener
   * @param { String } template - HTML template for the component
   */
  constructor(infoPlaceholderId, props) {
    super(infoPlaceholderId, props, template);
  }
}
