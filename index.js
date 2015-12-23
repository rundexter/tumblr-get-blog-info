var _ = require('lodash'),
    util = require('./util.js');

var request = require('request').defaults({
    baseUrl: 'https://api.tumblr.com/v2/'
});

var pickInputs = {
        'base-hostname': 'base_hostname',
        'api_key': 'api_key'
    },
    pickOutputs = {
        'title': 'response.blog.title',
        'posts': 'response.blog.posts',
        'name': 'response.blog.name',
        'updated': 'response.blog.updated',
        'description': 'response.blog.description',
        'ask': 'response.blog.ask',
        'ask_anon': 'response.blog.ask_anon',
        'likes': 'response.blog.likes'
    };

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var inputs = util.pickStringInputs(step, pickInputs),
            uriLink = 'blog/' + inputs.base_hostname + '/info';

        if (!inputs.base_hostname || !inputs.api_key)
            return this.fail('A [base-hostname, api_key] need for this module');

        //send API request
        request.put({
            url: uriLink,
            qs: {api_key: inputs.api_key + ''},
            json: true
        }, function (error, response, body) {
            if (error)
                this.fail(error);

            else if (_.parseInt(response.statusCode) !== 200)
                this.fail(body);

            else
                this.complete(util.pickResult(body, pickOutputs));
        }.bind(this));
    }
};
