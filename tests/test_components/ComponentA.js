var isNode = typeof module !== 'undefined' && module.exports;
var React = isNode ? require('react') : window.React;
var ReactDOM = isNode ? require('react-dom') : window.ReactDOM;

var ComponentA = React.createClass({

  render: function() {

    return (

      <div id = "a">
        {this.props.messageA}
      </div>

    );

  }

});

if(isNode) {

  module.exports = ComponentA;

} else {

  ReactDOM.render(<ComponentA messageA= {window.initial_props.messageA}/>, document.getElementById('component-a'));

}
