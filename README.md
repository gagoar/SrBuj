SrBuj
=

[![Gem Version](https://badge.fury.io/rb/SrBuj.png)](https://rubygems.org/gems/SrBuj)[![Dependency Status](https://gemnasium.com/gagoar/SrBuj.png)](https://gemnasium.com/gagoar/SrBuj) [![Code Climate](https://codeclimate.com/github/gagoar/SrBuj.png)](https://codeclimate.com/github/gagoar/SrBuj)[![Travis-CI](https://travis-ci.org/gagoar/SrBuj.png)](https://travis-ci.org/gagoar/SrBuj)[![endorse](https://api.coderwall.com/gagoar/endorsecount.png)](https://coderwall.com/gagoar)

Better Unobtrusive JavaScript Respond (for Rails and jquery_ujs, twitter/bootstrap modal.js)

SrBuj comes to cure a common illness in a life of every Rails developer (maybe other kind too):

  - write the same code to rise up a modal
  - render a partial on it.
  - change an element in a view without reload the entire web page
  - replace content of an element (GET)
  - add an element (POST)
  - remove an element (DELETE)
  - replace an specific element (PUT/PATCH)
  - bind a callback to run specific js function.

Every time, we end up with a lot of code, ugly code, messy code or at best with an old and known .js.rb file with the same 4 lines... Well enough it's enough!
This is the cure...and comes with a simple treatment too!

Steps:
=

1. bundle the gem
2. required in your manifest
3. add the 'magic data attributes' to the element
4. enjoy the js-less ! :-)

This unobtrusive scripting support file is developed for the Ruby on Rails framework, but is not strictly tied to any specific backend. You can drop this into any application.

These features are achieved by adding certain ["data" attributes][data] to your HTML markup. In Rails, they are added by the framework's template helpers.


Requirements
=

- [jQuery 1.7.x or higher](http://jquery.com/);
- [jquery_ujs](https://github.com/rails/jquery-ujs)
- [twitter/bootstrap modal.js plugin](http://twitter.github.com/bootstrap/javascript.html#modals) or any .modal()/.modal('toggle') function attached to the jquery element.
- HTML5 doctype (optional).

If you don't use HTML5, adding "data" attributes to your HTML4 or XHTML pages might make them fail [W3C markup validation][validator]. However, this shouldn't create any issues for web browsers or other user agents.

Installation
=

For automated installation in Rails, use the "jquery-rails" gem. Place this in your Gemfile:

````ruby
  gem 'SrBuj'
````

And run:

    $ bundle install

use the generator:

    $ bundle exec rails g sr_buj:install


or the manual way:

For Rails 3.1 and higher, add `//= require SrBuj` in your `app/assets/javascripts/application.js` file like this:

```javascript
//= require jquery
//= require jquery_ujs
//= require SrBuj
```

and add `*= require SrBuj` in your `app/assets/stylesheets/application.css` file:

```css
 /*
 *= require_self
 *= require SrBuj
 *= require_tree .
 */
```

Use and Options
=

  - `data-target`: Depending on the type of request(`GET`/`PUT`/`POST`/`DELETE`) is used to alter the Dom. it represent the element that we want to alter in the view after an succceded request (needed)

  - `data-modal`: If you wish that the response ends up in a modal (default: false).

  - `data-error`: The id element where errors will be rendered if the response received a different state than 200(Ok).

  - `data-delete`: On a successded response, remove the 'data-target' element from document.

  - `data-nochange`: Don't alter the Document.(ignore the verb).

  - `data-callback`: After a succeeded response, call this function.

  - `data-custom`: Just proxy the response to `data-callback` function. (default: false).

  - `data-jqueryselector`: Change the `data-target` & `data-error` for selectors in jquery and find the element!

  - `data-respond-as`: We can alter the respond behavior without careing the method used on the request. values: `GET`/`POST`/`PUT`/`PATCH`/`DELETE`

  - `data-push`: if there is a href or action in the element, replace the url.(default: false)

You can use it with any html element available. (links forms tables divs...Anything).

Example
=

modal
----
in your view (example with a link and haml)

````haml
 = link_to 'add Element', elements_path, remote: true, data: {target: 'partial-id', modal: true}


#partial-id

````

in your controller

```` ruby
  def new
    @element= Element.new
    render partial: 'new', content_type: 'text/html' #=> the content_type stands for telling the js request that everything ends up
fine.
  end
````

that's it.

Notifications
----

From javascript

$.SrBuj.Util.notify({ message: 'This is madness!' })

From your controller

js_notify(message: 'This is madness!')

Required options:

:message

Other options:

|  Option  | Posible Values            | Default  |
| -------- |:-------------------------:| :-------:|
| type     | :info, :warning, :error   |  :info   |
| side     | :left, :right             |  :right  |
| position | :top, :bottom             |  :bottom |
| time     | time in ms, -1            |  2000    |

Testing
=

You need [Node](http://nodejs.org) and [Testem](https://github.com/airportyh/testem) to run the tests.

1. Install

````
  npm install testem -g
````

2. Run

````bash
  testem ci # For test with all launchers
  ####  or  ####
  testem # and enter in http://localhost:7357
````


Contributing
=

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Copyright
=

Copyright (c) 2013 gagoar. See LICENSE.txt for
further details.



[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/gagoar/srbuj/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

