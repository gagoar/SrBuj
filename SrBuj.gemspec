# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'SrBuj/version'

Gem::Specification.new do |spec|
  spec.name          = "SrBuj"
  spec.version       = SrBuj::VERSION
  spec.authors       = ["gagoar"]
  spec.email         = ["xeroice@gmail.com"]
  spec.description   = %q{Better Unobtrusive JavaScript Request in asset pipeline}
  spec.summary       = %q{http://github.com/gagoar/SrBuj/}
  spec.homepage      = "http://gagoar.github.com/SrBuj/"
  spec.license       = "MIT"
  spec.files         = Dir["{lib,vendor}/**/*"] + ["LICENSE.txt", "README.md"]
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]


  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_dependency "railties", "~> 3.1"
  spec.add_development_dependency "rake"
end
