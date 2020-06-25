import '@4tw/cypress-drag-drop';

Cypress.Commands.add('setPreviewDataInput', (input) => {
  cy.get('#screen-builder-container').then((div) => {
    div[0].__vue__.previewInput = typeof input === 'string' ? input : JSON.stringify(input);
  });
});

Cypress.Commands.add('assertPreviewData', (expectedData) => {
  cy.get('#screen-builder-container').then((div) => {
    const data = div[0].__vue__.previewData;
    expect(data).to.eql(expectedData);
  });
});

Cypress.Commands.add('setMultiselect', (selector, text) => {
  cy.get(`${selector}`).click();
  cy.get(`${selector} span:contains("${text}"):first`).click();
});

Cypress.Commands.add('setVueComponentValue', (selector, value) => {
  cy.get(selector).then((div) => {
    div[0].__vue__.$emit('change', value);
  });
});

/**
 * Converts Cypress fixtures, including JSON, to a Blob. All file types are
 * converted to base64 then converted to a Blob using Cypress
 * expect application/json. Json files are just stringified then converted to
 * a blob (prevents issues with invalid string decoding).
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 * @return {Promise} Resolves with blob containing fixture contents
 */
function getFixtureBlob(fileUrl, type) {
  return type === 'application/json'
    ? cy
      .fixture(fileUrl)
      .then(JSON.stringify)
      .then(jsonStr => new Blob([jsonStr], { type: 'application/json' }))
    : cy.fixture(fileUrl, 'base64').then(Cypress.Blob.base64StringToBlob);
}

/**
 * Uploads a file to an input
 * @memberOf Cypress.Chainable#
 * @name uploadFile
 * @function
 * @param {String} selector - element to target
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 */
Cypress.Commands.add('uploadFile', (selector, fileUrl, type = '') => {
  return cy.get(selector).then(subject => {
    return getFixtureBlob(fileUrl, type).then(blob => {
      return cy.window().then(win => {
        const el = subject[0];
        const nameSegments = fileUrl.split('/');
        const name = nameSegments[nameSegments.length - 1];
        const testFile = new win.File([blob], name, { type });
        const dataTransfer = new win.DataTransfer();
        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;
        return subject;
      });
    });
  });
});
