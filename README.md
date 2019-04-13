# Reactsir.js

Trying to manage the rendering of all your React components on the server can get tedious and cumbersome, especially when properties change depending on state in the server. Reactsir provides a more intuitive way to manage your React components.

## Getting Started

### Prerequisites

Reactsir requires that you are using [Express.js](https://expressjs.com), and some sort of templating engine.

### Installing / Code Examples

```
npm install reactsir
```

Reactsir is basically just a middleware function. You pass it to your app and provide the file path for the ```reactsir-config.js``` file. You can name this whatever you want, and you can have different config files for different parts of your app (ex. different router objects);

There are 3 steps to using Reactsir:

* specify and create a reactsir-config file
* dock and render components
* sync the React DOM

### Step 1

```
var express = require('express');
var app = express();

app.use(reactsir({
  file: __dirname + '/reactsir-config.js',
  universal: ['ComponentB']
}));

```

```reactsir-config.js``` is where you specify the components you will render on the server, as well as their properties. we pass the path to this file, and (optionally) pass the names of any components we want to be rendered no matter what route handler. For example, if you have a page header component, you may want to render that on every page, so you would include it in the ```universal``` array.

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

### Step 2

You can name the component whatever you want here, but it is best that it remains consistent with your react code. ```file``` specifies the path to the component, and ```rootProps``` specifies any properties your component requires. This is where you place your default property value (assuming it ever changes).

Here is where reactsir becomes useful. In your route handlers, you can specify which components you wish to use for this handler, then render them with whatever new property values you want to assign.

```
app.get('/', function(req, res) {

  res.components.use(['ComponentA']);
  res.components.render('index', {
      messageA: 'This is a new message'
  });

});

```

```res.components.use``` takes an array of component names. **Make sure it corresponds to a component name in your config file**. ```res.components.render``` is an extension of Express's ```res.render``` method. Just like the normal render method, you can pass any kinds of variables you'd like and they will be available in your template file, but now you can also set property values of components you mounted in ```res.components.use```.

### Step 3

Your components are set and ready on the server, but the React DOM on the client is not identical to the one on the server. You need to sync the React DOM.

Your components are now available to you in your template with the same name as specified in the config file. You can put your initial component properties in a variable to be used by the client-side version of your components. This way, the server-side and client-side virtual DOMs are identical and you can reap the benefits of server side rendering with React.

Here is an example:

```
//USING PUG TEMPLATE ENGINE

doctype html
html
  head
    title reactsir test page
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

Synchronizing the React DOM is not apart of Reactsir, so you can handle that however you'd like. All Reactsir does is pass the correct properties and stringified components to your template. It's up to you to determine how you wish to synchronize the data.

## Test Project

There is a test folder included in this repository. You can download everything and run it using:

```
node tests/server.js
```

then going to ```http://localhost:3333/```. It will display a message saying ```I am component A``` and ```I am component B```. I would recommend playing around in this test folder to get a feel for how Reactsir can be setup and used.
