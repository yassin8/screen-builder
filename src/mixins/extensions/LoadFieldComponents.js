export default {
  methods: {
    loadFieldProperties({ properties, element, componentName, definition }) {
      properties.class = this.elementCssClass(element);
      properties[':validation-data'] = 'vdata';
      if (componentName === 'FormImage') {
        this.registerVariable(element.config.variableName, element.config);
        delete properties.image;
        properties[':image'] = this.byRef(element.config.image);
      } else if (this.validVariableName(element.config.name)) {
        this.registerVariable(element.config.name, element.config);
        properties['v-model'] = `${element.config.name}`;
      }
      // Do not replace mustache in RichText control, it is replaced by the control
      if (componentName === 'FormHtmlViewer') {
        delete properties.content;
        properties[':content'] = this.byValue(element.config.content);
      }
      // Add cypress testing tags
      if (element.config.name) {
        properties['data-cy'] = `screen-field-${element.config.name}`;
      }
      properties[':ancestor-screens'] = '$parent && $parent.ancestorScreens';
      properties.name = element.config.name !== undefined ? element.config.name : null;
      properties.disabled = element.config.interactive || element.config.disabled;
      properties[':form-config'] = this.byRef(this.configRef || definition.config);
      // Events
      properties['@submit'] = 'submitForm';
    },
  },
  mounted() {
    this.extensions.push({
      onloadproperties(params) {
        if (!params.element.container) {
          this.loadFieldProperties(params);
        }
        params.properties[':config'] = this.byValue(params.element.config);
        params.properties[':transientData'] = 'vdata';
      },
    });
  },
};