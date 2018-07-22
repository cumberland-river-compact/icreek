import './not-found.scss';
import template from './not-found.html';
import Component from '../component';

/**
 * 404 NotFound Component
 * @extends Component
 */
export default class NotFound extends Component {
  /**
   * NotFound Component Constructor
   * @param { String } notFoundPlaceholderId - Id for the DOM element which will hold the content
   * @param { Object } props.events.click NotFound item click listener
   * @param { String } template - HTML template for the component
   */
  constructor(notFoundPlaceholderId, props) {
    super(notFoundPlaceholderId, props, template);
  }
}
