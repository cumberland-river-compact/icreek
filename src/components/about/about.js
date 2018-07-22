import './about.scss';
import template from './about.html';
import Component from '../component';

/**
 * About Component
 * @extends Component
 */
export default class About extends Component {
  /**
   * About Component Constructor
   * @param { String } aboutPlaceholderId - Id for the DOM element which will hold the content
   * @param { Object } props.events.click About item click listener
   * @param { String } template - HTML template for the component
   */
  constructor(aboutPlaceholderId, props) {
    super(aboutPlaceholderId, props, template);
  }
}
