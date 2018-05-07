import './info.scss';
import template from './info.html';
import Component from '../component';

/**
 * Info Component
 * @extends Component
 */
export default class Info extends Component {
  constructor(placeholderId, props) {
    super(placeholderId, props, template);
  }
}
