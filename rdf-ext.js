/* global window */
'use strict';


var rdf = require('rdf-graph-array');
var InMemoryStore = require('rdf-store-inmemory');


rdf.isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);


var mixin = function (rdf, options) {
  options = options || {};

  require('./lib/environment')(rdf)

  if (typeof window !== 'undefined') {
    window.rdf = rdf;
  }

  rdf.defaultRequest = null;
  rdf.corsProxyRequest = null;

  require('./lib/utils')(rdf);

  if (rdf.isNode) {
    require('./lib/utils-node')(rdf);
  } else {
    require('./lib/utils-browser')(rdf);
  }

  rdf.createBlankNode = function () {
    return new rdf.BlankNode();
  };

  rdf.createNamedNode = function (iri) {
    return new rdf.NamedNode(iri);
  };

  rdf.createLiteral = function (value, language, datatype) {
    return new rdf.Literal(value, language, datatype);
  };

  rdf.createTriple = function (subject, predicate, object) {
    return new rdf.Triple(subject, predicate, object);
  };

  rdf.createQuad = function (subject, predicate, object, graph) {
    return new rdf.Quad(subject, predicate, object, graph);
  };

  rdf.createGraph = function (triples) {
    return new rdf.Graph(triples);
  };

  // Use InMemoryStore as default store
  rdf.createStore = function (options) {
    options = options || {}
    options.rdf = options.rdf || rdf

    return new InMemoryStore(options);
  };

  return rdf;
};

mixin(rdf)

module.exports = rdf;
