import './home.scss';
import template from './home.html';
import Component from '../component';

/**
 * Home Component
 * @extends Component
 */
export default class Home extends Component {
  /**
   * Home Component Constructor
   * @param { String } homePlaceholderId - Id for the DOM element which will hold the content
   * @param { Object } props.events.click Home item click listener
   * @param { String } template - HTML template for the component
   */
  constructor(homePlaceholderId, props) {
    super(homePlaceholderId, props, template);

    this.refs.addressInput.addEventListener('input', () =>
      console.log('Input!')
    );

    this.refs.searchButton.addEventListener('click', () =>
      console.log('Clicked!')
    );
  }
}
