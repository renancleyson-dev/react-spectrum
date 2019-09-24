
let rspProject = 'React Spectrum v3';
let otherProject = 'other';

module.exports = function (plop) {
  plop.setActionType('renameMany', require('./plop-actions/renameMany'));
  plop.setHelper('replace', function (match, replacement, options) {
    let string = options.fn(this);
    return string.replace(match, replacement);
  });
  // controller generator
  plop.setGenerator('component', {
    description: 'add new component',
    prompts: [{
      type: 'list',
      name: 'projectType',
      message: 'what type of project are you setting up',
      choices: [rspProject, otherProject]
    }, {
      type: 'checkbox',
      name: 'scopes',
      message: 'scope name(s)',
      choices: ['@react-aria', '@react-spectrum', '@react-stately'],
      validate: (answer) => answer.length > 0,
      when: ({projectType}) => projectType === rspProject
    }, {
      type: 'input',
      name: 'scopeName',
      message: 'scope name for new package',
      validate: (answer) => answer.length > 0,
      when: ({projectType}) => projectType === otherProject
    }, {
      type: 'input',
      name: 'packageName',
      message: 'package name',
      validate: (answer) => answer.length > 0
    }, {
      type: 'input',
      name: 'componentName',
      message: 'component name, please use appropriate uppercase',
      validate: (answer) => answer.length > 0,
      when: ({projectType}) => projectType === rspProject
    }, {
      type: 'input',
      name: 'componentCSS',
      message: 'component css module name, blank if N/A',
      validate: (answer) => answer.length > 0,
      when: ({projectType, scopes}) => projectType === rspProject && scopes.includes('@react-spectrum')
    }],
    actions: function (data) {
      let {projectType, scopes, scopeName, packageName, componentName, componentCSS} = data;
      let actions = [];
      if (projectType === rspProject) {
        if (scopes.includes('@react-aria')) {
          actions.push({
            type: 'addMany',
            templateFiles: 'plop-templates/@react-aria/**',
            base: 'plop-templates/@react-aria/',
            destination: `packages/@react-aria/${packageName}`,
            data: {componentName}
          });
          actions.push({
            type: 'renameMany',
            templateFiles: `packages/@react-aria/${packageName}/**`,
            renamer: name => `${name.replace('Component', componentName)}`
          });
        }

        if (scopes.includes('@react-spectrum')) {
          actions.push({
            type: 'addMany',
            templateFiles: 'plop-templates/@react-spectrum/**',
            base: 'plop-templates/@react-spectrum/',
            destination: `packages/@react-spectrum/${packageName}`,
            data: {packageName, componentName, componentCSS}
          });
          actions.push({
            type: 'renameMany',
            templateFiles: `packages/@react-spectrum/${packageName}/**`,
            renamer: name => `${name.replace('Component', componentName)}`
          });
        }

        if (scopes.includes('@react-stately')) {
          actions.push({
            type: 'addMany',
            templateFiles: 'plop-templates/@react-stately/**',
            base: 'plop-templates/@react-stately/',
            destination: `packages/@react-stately/${packageName}`,
            data: {packageName, componentName}
          });
          actions.push({
            type: 'renameMany',
            templateFiles: `packages/@react-stately/${packageName}/**`,
            renamer: name => `${name.replace('Component', componentName)}`
          });
        }
      } else {
        actions.push({
          type: 'addMany',
          templateFiles: 'plop-templates/@scope/**',
          base: 'plop-templates/@scope/',
          destination: `packages/@${scopeName}/${packageName}`,
          data: {scopeName, packageName, componentName}
        });
      }

      return actions;
    }
  });
};