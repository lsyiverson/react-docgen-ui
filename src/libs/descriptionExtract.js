import _ from 'lodash';
import doctrine from 'doctrine';

function descriptionExtract(descriptionString) {
  if (_.isUndefined(descriptionString)) {
    return null;
  }
  return doctrine.parse(descriptionString, {
    sloppy: true,
    tags: [
      'example',
      'exampleFile'
    ]
  });
}

export default descriptionExtract;
