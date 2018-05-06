import './info-panel.scss';
import template from './info-panel.html';
import Component from '../component';

/**
 * Info Panel Component
 * @extends Component
 */
export default class InfoPanel extends Component {
  constructor(placeholderId, props) {
    super(placeholderId, props, template);
  }
}
