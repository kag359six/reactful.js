/*
  reactful.js manages server-side react components and provides a simple
  api to render multiple components on the server

  GOAL: Rendering separate components into one template sucks.
  This module should be able to minimize the management of components
  in handlers, as well as make it easy to render multiple components at once,
  even if they are unrelated.

  TO DO:
    #configure to work as standalone npm module
    #load components using path relative to user's project folder

*/

var TEST_MODE = true;

require('babel-register')({
  "presets": ["react", "es2015"]
});

var React = require('react');
var ReactDOM = require('react-dom/server');

function Component(props, factory, name) {

  this.props = props;
  this.factory = factory;
  this.name = name;
  this.toString = function() {
    return ReactDOM.renderToString(this.factory(this.props));
  };

}

function ComponentManager(setup) {

  var PROJECT_ROOT = TEST_MODE ? './' : '../../../';

  var components = {};
  var activeComponents = [];

  //retrieve components from file and store
  var config = require(PROJECT_ROOT + setup.file);
  for(var name in config) {

    if(config.hasOwnProperty(name)) {

      var comp = config[name];
      var compObject = require(PROJECT_ROOT + comp.file); //make relative to user project folder
      var compFactory = React.createFactory(compObject);
      components[name] = new Component(comp.rootProps, compFactory, name);

    }

  }

  //add universal components to list of active components
  setup.universal.forEach(function(compName) {
    activeComponents.push(components[compName]);
  });

  //ex: use(['HeaderComponent', 'SignupComponent'])
  this.use = function(componentArray) {

    componentArray.forEach(function(name) {
      activeComponents.push(components[name]);
    });

  };

  //gets components, converts them to strings, then renders them to view
  //placeholder names are the same as react components
  this.render = function(viewPath, props) {

    var data = {};
    data.props = {};
    props = (props !== undefined) ? props : {};

    activeComponents.forEach(function(c) {
      for(var key in c.props) {
        if(props.hasOwnProperty(key)) {
          c.props[key] = props[key]; //override props with input props
        }
        data.props[key] = c.props[key];
      }
      data[c.name] = c.toString(); //render comp to string
    });

    //include global variables not attached to components
    for(var key in props) {
      data.props[key] = props[key];
    }

    data.props = JSON.stringify(data.props);
    this.res.render(viewPath, data);

  };

  return function(req, res, next) {

    this.res = res;
    res.components = this;
    return next();

  }

}

module.exports = ComponentManager;
