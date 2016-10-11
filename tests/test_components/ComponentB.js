var isNode = typeof module !== 'undefined' && module.exports;
var React = isNode ? require('react') : window.React;
var ReactDOM = isNode ? require('react-dom') : window.ReactDOM;

var ComponentB = React.createClass({

  render: function() {

    return (

      <div id = "b">
        {this.props.messageB}
      </div>

    );

  }

});

if(isNode) {

  module.exports = ComponentB;

} else {

  ReactDOM.render(<ComponentB messageB= {window.initial_props.messageB}/>, document.getElementById('component-b'));

}
