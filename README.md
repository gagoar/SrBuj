SrBuj
=

Better Unobtrusive JavaScript Request (for Rails and jquery_ujs, twitter/bootstrap modal.js)

 - Do you need render a partial in your web with out reload?, and make a modal out of it?(depends on twitter/Bootstrap modal.js)
 - Do you need remove an element from a list?
 - Do you need replace an element after update?


This unobtrusive scripting support file is developed for the Ruby on Rails framework, but is not strictly tied to any specific backend. You can drop this into any application to:

- get modals out of the box, via js
- make non-GET requests from hyperlinks
- make forms or hyperlinks submit data asynchronously with Ajax and handle the response in a dry way;

These features are achieved by adding certain ["data" attributes][data] to your HTML markup. In Rails, they are added by the framework's template helpers.

Requirements
------------

- [jQuery 1.7.x or higher][jquery];
- [twitter/bootstrap modal.js plugin]
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

Use
---
data[target] = id Element in to render the response before success
data[modal] = true|false if you wish that repsonse execute in modal (default false)
data[error] = id Element In a form data[error] is the holder in witch de form re renders to show the errors
data[replace] = true|false if you wish replace de data[target] element with the response content on success (default false)
data[remote] && data[target] = combined the success response execute a remove() over the target element


Example
---

in your view (example with a link)

````haml
 = link_to 'add Element' elements_path, remote: true, data: {target: 'partial-id', modal: true}


#partial-id

````

in your controller

```` ruby
  def new
    @element= Element.new
    render partial: 'new', content_type: 'text/html'
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

