import _ from 'lodash';
import marked from 'marked';

import descriptionExtract from './descriptionExtract';
import getExampleContents from './getExampleContents';

function defaultDescriptionCompiler(string){
  return marked(string)
}

function descriptionProcess(targetObj = {}, options = {}) {

  let descObj = descriptionExtract(targetObj.description);

  if (descObj) {

    const descriptionCompiler = _.isFunction(options.descriptionCompiler) ? options.descriptionCompiler: defaultDescriptionCompiler

    descObj = {
      description: descriptionCompiler(descObj.description),
      examples: pickExampleFromTags(descObj.tags, options)
    };

    if (_.isObject(targetObj.props)) {
      _.forEach(_.keys(targetObj.props), function (key) {
        targetObj.props[key] = descriptionProcess(targetObj.props[key], options);
      });
    }

    return _.merge({}, targetObj, descObj);
  }

  return targetObj;
}

function pickExampleFromTags(tags = [], options = {}) {
  return _.reduce(tags, function (exampleList, tagItem) {
    return exampleList.concat(getExampleContents(tagItem, options))
  }, [])
}

export default descriptionProcess;
