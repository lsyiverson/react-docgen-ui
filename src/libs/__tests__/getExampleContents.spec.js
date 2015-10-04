import { expect } from 'chai';
import fs from 'fs';
import path from 'path';

import getExampleContents from '../getExampleContents'

describe(__filename, function () {

  context('getExampleContents', ()=> {

    it('should get example contents from example tag', function () {

      let tags = {
        'title': 'example',
        'description': [
          'let react = require(\'react\')',
          'import _ from \'lodash\''
        ].join('\n')
      };

      expect(getExampleContents(tags))
        .to.be.deep.equal({
          requireList: [
            {
              path: 'lodash',
              src: 'import _ from \'lodash\'',
              dest: 'import _ from \'lodash\''
            },
            {
              path: 'react',
              src: 'require(\'react\')',
              dest: 'require(\'react\')'
            }
          ],
          contents: tags.description
        });

    });

    context('should get example file path from exampleFile tag', ()=> {
      let tags;

      beforeEach(()=> {
        tags = {
          'title': 'exampleFile',
          'description': './Component.jsx'
        };

        createComponentFile([
          'let react = require(\'react\');',
          'import Component from \'../__tests__/Component.jsx\';'
        ].join('\n'))

      });

      afterEach(()=> {
        cleanComponentFile();
      });

      it('and should get contents from this file path', function () {
        expect(
          getExampleContents(tags, {
            basedir: __dirname
          }).contents
        ).to.be.contain(path.join(__dirname, './Component'))
      });


      it('and should get contents from this file path but replace', function () {
        expect(getExampleContents(tags, {
            basedir: __dirname,
            cwd: process.cwd()
          }).contents
        ).to.be.contain(path.relative(
            process.cwd(),
            path.join(__dirname, './Component')
          ));
      });

    });

  })

});


function createComponentFile(componentString) {
  componentString = componentString || `
    import React from \'react\'
    export default React.createClass({})
  `;
  fs.writeFileSync(path.join(__dirname, '/Component.jsx'), componentString)
}

function cleanComponentFile() {
  fs.unlinkSync(path.join(__dirname, '/Component.jsx'));
}