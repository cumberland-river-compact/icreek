// This base component class provides view ref binding, template insertion,
// and event listeners setup.
export default class Component {
  /**
   * Component Constructor
   * @param { String } placeholderId - Id for the DOM element which will hold the component
   * @param { Object } props - Component properties
   * @param { Object } props.events - Component event listeners
   * @param { Object } props.data - Component data properties
   * @param { String } template - HTML template for the component
   */
  constructor(placeholderId, props = {}, template) {
    this.componentElem = document.getElementById(placeholderId);

    if (template) {
      // Load template into placeholder element
      this.componentElem.innerHTML = template;

      // Assign each DOM element with a ref tag to this.refs
      // This allows easy access to elements within the template.
      // For example, `<div ref="title"></div>` can be altered
      // with `this.refs.title.innerHTML = "I am a component!"`
      this.refs = {};
      const refElems = this.componentElem.querySelectorAll('[ref]');
      refElems.forEach(elem => {
        this.refs[elem.getAttribute('ref')] = elem;
      });
    }

    if (props.events) {
      this.createEvents(props.events);
    }
  }

  // Read "event" component parameters, and attach event listeners for each
  createEvents(events) {
    Object.keys(events).forEach(eventName => {
      this.componentElem.addEventListener(eventName, events[eventName], false);
    });
  }

  // Trigger a component event with the provided "detail" payload
  triggerEvent(eventName, detail) {
    const event = new window.CustomEvent(eventName, { detail });
    this.componentElem.dispatchEvent(event);
  }
}
