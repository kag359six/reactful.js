#Reactful.js

Trying to manage the rendering of all your React components on the server can get tedious and cumbersome, especially when properties change depending on state in the server. Reactful provides a more intuitive way to manage your React components.

##Getting Started

###Prerequisites

Reactful requires that you are using [Express.js](https://expressjs.com), and some sort of templating engine.

###Installing / Code Examples

```
npm install reactful

```

Reactful is basically just a middleware function. You pass it to your app and provide the file path for the ```reactful-config.js``` file. You can name this whatever you want, and you can have different config files for different parts of your app (ex. different router objects);

```
var express = require('express');
var app = express();

app.use(reactful({
  file: __dirname + '/reactful-config.js'
}));

```

What is the ```reactful-config.js``` file for? It is where you specify the components you will render on the server, as well as their properties.

```
module.exports = {

  ComponentA: {
    file: __dirname + '/test_components/ComponentA.js',
    rootProps: {
      messageA: 'I am component A'
    }
  }

};

```

You can name the component whatever you want here, but it is best that it remains consistent with your react code. ```file``` specifies the path to the component, and ```rootProps``` specifies any properties your component requires. This is where you place your default property value (assuming it ever changes).

Here is where Reactful becomes useful. In your route handlers, you can specify which components you wish to use for this handler, then render them with whatever new property values you want to assign.

```
app.get('/', function(req, res) {

  res.components.use(['ComponentA']);
  res.components.render('index', {
      messageA: 'This is a new message'
  });

});

```

```res.components.use``` takes an array of component names. **Make sure it corresponds to a component name in your config file**. ```res.components.render``` is an extension of Express's ```res.render``` method. Just like the normal render method, you can pass any kinds of variables you'd like and they will be available in your template file, but now you can also set property values of components you mounted in ```res.components.use```.

###syncing the React DOM on the client and server

Your components are now available to you in your template with the same name as specified in the config file. You can put your initial component properties in a variable to be used by the client-side version of your components. This way, the server-side and client-side virtual DOMs are identical and you can reap the benefits of server side rendering with React.

Here is an example:

```
//USING PUG TEMPLATE ENGINE

doctype html
html
  head
    title reactful test page
    script(src='https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react.js')
    script(src='https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react-dom.js')
    script(src='https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js')
  body
    div(id="component-a")!= ComponentA
  script window.initial_props = !{props}
  script(src='http://localhost:3333/public/ComponentA.js' type="text/babel")

```

There are two important pieces to this code. First, we load the necessary libraries, then append our components to a div. Again, the variable name **must** be identical to the name specified in the config file.

```
body
  div(id="component-a")!= ComponentA

```

Second, we pass our properties held in ``props``` to a variable we attach to the window object. This is what we will use in our component definitions in order to initialize the client-side components with the same properties as the corresponding server-side components.

```
script window.initial_props = !{props}

```

Here is how we might use this variable to initialize our components:

```
if(onServer) {

  module.exports = ComponentA;

} else {

  ReactDOM.render(<ComponentA messageA= {window.initial_props.messageA}/>, document.getElementById('component-a'));

}
```

If we are on the server, we simply export our component. Otherwise, we render it as we normally would, except now we initialize it with the ```window.initial_props.messageA``` property.

##Test Project

There is a test folder included in this repository. You can download everything and run it using:

```
node tests/server.js
```

then going to ```http://localhost:3333/```. It will display a message saying ```I am component A``` and ```I am component B```. I would recommend playing around in this test folder to get a feel for how reactful can be setup and used.
