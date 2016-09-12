const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({host: 'localhost:9200'});
const indexName = 'klartext';
const Promise = require('bluebird');

module.exports = {
    client: client,

    indexExists() { return this.client.indices.exists({index: 'klartext'}); },
    
    deleteIndex() {
        return this.indexExists().then(exists => {
            if(exists) return this.client.indices.delete({index: 'klartext'});
            return Promise.resolve();
        });
    },

    initIndex() {
        return this.deleteIndex().then(() => {
            return this.client.indices.create({
                index: 'klartext',
                body: {
                    settings: {
                        analysis: {
                            analyzer: {
                                word_analyzer: {type: 'snowball', language: 'Swedish'}
                            }
                        }
                    }
                }
            });
        });
    },

    initWordType() {
        return client.indices.putMapping({
            index: 'klartext',
            type: 'words',
            body: {
                properties: {
                    value: {type: 'string',analyzer: 'word_analyzer'},
                    class: {type: 'string', index: 'not_analyzed'},
                    sound: {type: 'string', index: 'not_analyzed'},
                    pronoun: {type: 'string', index: 'not_analyzed'},
                    translations: {type: 'string', index: 'not_analyzed'},
                    inflection: {type: 'string',analyzer: 'word_analyzer'},
                    synonym: {type: 'string', index: 'not_analyzed'},
                    definition: {
                        type: 'nested',
                        include_in_parent: true,
                        properties: { value: {type: 'string', index: 'not_analyzed'}}
                    },
                    example: {
                        type: 'nested',
                        include_in_parent: true,
                        properties: { value: {type: 'string', index: 'not_analyzed'}}
                    },
                    idiom: {
                        type: 'nested',
                        include_in_parent: true,
                        properties: { value: {type: 'string', index: 'not_analyzed'}}
                    },
                    derivation: {
                        type: 'nested',
                        include_in_parent: true,
                        properties: { value: {type: 'string', index: 'not_analyzed'}}
                    },
                    compund: {
                        type: 'nested',
                        include_in_parent: true,
                        properties: { value: {type: 'string', index: 'not_analyzed'}}
                    },
                    explanation: {
                        type: 'nested',
                        include_in_parent: true,
                        properties: { value: {type: 'string', index: 'not_analyzed'}}
                    }
                }
                
            }
        });
    },
    search(q) {
        return this.client.search({
            index: 'klartext',
            type: 'words',
            body: {
                query: {
                    multi_match: {
                        query: q,
                        analyzer: 'word_analyzer',
                        fields: ['value','inflection']
                    }
                }
            }
        }).then(res => res.hits.hits);
    }
};
