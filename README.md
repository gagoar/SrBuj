SrBuj
=

Better Unobtrusive JavaScript Request (for Rails and jquery_ujs, twitter/bootstrap modal.js)

SrBuj comes to cure a common illness in a life of every Rails developer (maybe other kind too):
  - write the same code to rise up a modal
  - render a partial on it.
  - change an element in a view without reload the entire web page
  - replace content of an element (GET)
  - add an element (POST)
  - remove an element (DELETE)
  - replace an specific element (PUT/PATCH)
  - bind a callback to run specific js function.

every time, we end up with a lot of code, ugly code, messy code...

And every time we end up doing an old and known .js.rb file, with the same 4 lines... Well enough it's enough!

This is the cure...  and comes with a simple treatment too!
Steps:
 1. Bundle the gem
 2. required in your manifest
 3. add the magic data attributes to the element
 4. Enjoy de js-less ! :-)

This unobtrusive scripting support file is developed for the Ruby on Rails framework, but is not strictly tied to any specific backend. You can drop this into any application to:

- get modals out of the box, via js
- make non-GET requests from hyperlinks
- make any submit data asynchronously with Ajax and handle the response in a dry way.

These features are achieved by adding certain ["data" attributes][data] to your HTML markup. In Rails, they are added by the framework's template helpers.

Requirements
------------

- [jQuery 1.7.x or higher](http://jquery.com/);
- [jquery_ujs](https://github.com/rails/jquery-ujs)
- [twitter/bootstrap modal.js plugin](http://twitter.github.com/bootstrap/javascript.html#modals) or any .modal()/.modal('toggle') function attached to the jquery element.
- HTML5 doctype (optional).

If you don't use HTML5, adding "data" attributes to your HTML4 or XHTML pages might make them fail [W3C markup validation][validator]. However, this shouldn't create any issues for web browsers or other user agents.

Installation
------------

For automated installation in Rails, use the "jquery-rails" gem. Place this in your Gemfile:

````ruby
  gem 'SrBuj'
````

And run:

    $ bundle install

This next step depends on your version of Rails.

a. For Rails 3.1, add these lines to the top of your app/assets/javascripts/application.js file:

```javascript
//= require jquery
//= require jquery_ujs
//= require SrBuj
```

Use and Options
---
  - target( data[target] ):  depending on the type of request(GET/PUT/POST/DELETE) is used to alter the Dom. it represent the element that we want to alter in the view after an succceded request (needed)
  - modal( data[modal] ): if you wish that the response ends up in a modal. value: true|false (default false)
  - error (data[error]): id Element In a form data[error] is the holder in witch de form re renders to show the errors
  - replace(data[replace]):  if you wish to replace de data[target] element with the response content on success. represent the PUT/PATCH action for SrBuj. value: true|false (default false)
  - remove (data[method:delete] && data[target]): if these are combined the success response execute a remove() over the data[target] element.
  - nochange (data[nochange]): do all but don't change the document in any way.
  - callback(data[callback]) = after a successeded request, call this function.
  - data[custom] = just proxy the response to my custom function in callback, nothing more.
  - jqueryselector(data[jqueryselector]): Change the data[target] & data[error] for selectors in jquery and find the element!

You can use it with any element available. (links forms tables divs anything).

Example
=======

modal
----
in your view (example with a link and haml)

````haml
 = link_to 'add Element' elements_path, remote: true, data: {target: 'partial-id', modal: true}


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

Contributing
------------

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Copyright
---------

Copyright (c) 2013 gagoar. See LICENSE.txt for
further details.

