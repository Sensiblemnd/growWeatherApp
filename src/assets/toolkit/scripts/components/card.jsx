var React = require('react');
var ReactDOM = require('react-dom');
var card = React.createClass({
render: function () {
    return (
      <div>
        Hello World!
      </div>
    )
  }
});


ReactDOM.render(<card />, document.getElementById('app'));