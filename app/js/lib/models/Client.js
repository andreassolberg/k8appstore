define(function(require, exports, module) {
    "use strict";

    var
        moment = require('bower/momentjs/moment'),
        Model = require('bower/feideconnectjs/src/models/Model'),
        // Scope = require('./Scope'),
        utils = require('bower/feideconnectjs/src/utils');

    function parseDate(input) {
        var x = input.substring(0, 19) + 'Z';
        return moment(x);
    }


    var Client = Model.extend({

        "getView": function() {
            var res = this._super();
            if (this.created) {
                res.created = parseDate(this.created);
                res.createdAgo = res.created.fromNow();
                res.createdH = res.created.format('D. MMM YYYY');
            }

            if (this.updated) {
                res.updated = parseDate(this.updated);
                res.updatedAgo = res.updated.fromNow();
                res.updatedH = res.updated.format('D. MMM YYYY');
            }

            if (this.organization && this.organization !== null) {
                res.trustOrg = true;
            } else if (this.owner && this.owner !== null) {
                res.trustOwner = true;
            }
            return res;
        },


        "getAPIAuthView": function() {
            var view = [];
            // console.error("this.scopeauthorizations", this);
            if (this.hasOwnProperty("scopeauthorizations")) {

                for (var key in this.scopeauthorizations) {
                    var x = {};
                    x.scope = key;
                    x.authorized = this.scopeauthorizations[key];
                    view.push(x);
                }
            }

            return view;
        },


        /**
         * Feed this with a the clients orgauthorizations, and it will return a matrix
         * containing rows of organizations, and which scopes they have authorized.
         * 
         * @param  {[type]} orgauthorizations [description]
         * @return {[type]}                   [description]
         */
        "getOrgAdminScopeMatrix": function(apigk) {
            var i, j;
            var data = {
                "scopes": [],
                "orgs": []
            };

            var orgauthorization = this.orgauthorization;
            var orgs = apigk.scopedef.getRealmList();
            var allScopes = this.getScopesObjects();
            var scopes = apigk.getOrgTargetedScopes(allScopes);

            if (scopes.length === 0) {
                // console.error("   ====> No orgadmin scopes here. ", this.name);
                return null;
            }

            for (i = 0; i < scopes.length; i++) {
                data.scopes.push({
                    "scope": scopes[i],
                    "descr": apigk.scopedef.getScopeDescr(scopes[i])
                });
            }

            // if(this.id === '541bc151-4a34-47c6-b9fb-15947dbf54ae' && apigk.id === 'scopetestapi') {
            //  console.error("Client " + this.name + " wants access to " + apigk.name);
            //  console.error("Org authorizations", orgauthorization);
            // }

            // console.error("Orgs", orgs);

            // console.error("All Scopes", allScopes);
            // console.error("Scopes", scopes);     

            for (i = 0; i < orgs.length; i++) {
                var org = orgs[i];
                var orgentry = {
                    "org": org,
                    "scopes": []
                };
                // console.error("ORGentry", orgentry);

                for (j = 0; j < scopes.length; j++) {
                    // if(this.id === '541bc151-4a34-47c6-b9fb-15947dbf54ae' && apigk.id === 'scopetestapi') {
                    // console.error("Check scopes ", org, scopes[j], this.hasOrgAuthorized(org, scopes[j]))
                    // }
                    orgentry.scopes.push(this.hasOrgAuthorized(org, scopes[j]));
                }
                data.orgs.push(orgentry);

            }

            return data;
        },



        "getAPIGKview": function(apigk) {

            var that = this;
            var bs = apigk.getBasicScope();
            var authz = this.scopeIsAccepted(bs);
            var v = this.getView();


            v.sd = apigk.scopedef.getView();
            v.sd.apigkid = apigk.id;
            v.sd.authz = authz;

            v.sd.req = false;
            if (!this.scopeIsAccepted(bs) && this.scopeIsRequested(bs)) {
                v.sd.req = true;
            }

            if (v.sd.subscopes) {
                for (var i = 0; i < v.sd.subscopes.length; i++) {
                    v.sd.subscopes[i].status = {};
                    var siq = bs + '_' + v.sd.subscopes[i].scope;
                    if (this.scopeIsAccepted(siq)) {
                        v.sd.subscopes[i].status.accepted = true;
                    } else if (this.scopeIsRequested(siq)) {
                        v.sd.subscopes[i].status.requested = true;
                        v.sd.req = true;
                    }

                }

            }


            v.orgadminscopematrix = this.getOrgAdminScopeMatrix(apigk);

            return v;

        },

        "setName": function(name) {
            this.name = name;
        },

        "setDescr": function(descr) {
            this.descr = descr;
        },

        "setOneRedirectURI": function(redirect_uri) {
            if (!this.redirect_uri) {
                redirect_uri = [];
            }
            if (redirect_uri.length < 1) {
                this.redirect_uri.push(redirect_uri);
            } else {
                this.redirect_uri[0] = redirect_uri;
            }

        },

        "addScopes": function(scopes) {
            for (var i = 0; i < scopes.length; i++) {
                this.addScope(scopes[i]);
            }
        },

        "addScope": function(scope) {
            var exists = false;
            var existingScopes = [];
            var newscopes = [];
            if (this.scopes_requested && this.scopes_requested.length) {
                existingScopes = this.scopes_requested;
            }
            for (var i = 0; i < existingScopes.length; i++) {
                if (existingScopes[i] === scope) {
                    exists = true;
                }
                newscopes.push(existingScopes[i]);
            }
            if (!exists) {
                newscopes.push(scope);
            }
            this.scopes_requested = newscopes;
        },

        "removeScope": function(scope) {
            var existingScopes = [];
            var newscopes = [];
            if (this.scopes_requested && this.scopes_requested.length) {
                existingScopes = this.scopes_requested;
            }
            for (var i = 0; i < existingScopes.length; i++) {
                if (existingScopes[i] !== scope) {
                    newscopes.push(existingScopes[i]);
                }
            }
            this.scopes_requested = newscopes;
        },

        /**
         * Check if a scope is found in "scopes"
         * @param  {[type]} scope [description]
         * @return {[type]}       [description]
         */
        "scopeIsAccepted": function(scope) {
            if (!this.scopes) {
                return false;
            }
            if (!this.scopes.length) {
                return false;
            }
            for (var i = 0; i < this.scopes.length; i++) {
                if (scope === this.scopes[i]) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Check if a scope is found in "scopes_requested"
         * @param  {[type]} scope [description]
         * @return {[type]}       [description]
         */
        "scopeIsRequested": function(scope) {
            if (!this.scopes_requested) {
                return false;
            }
            if (!this.scopes_requested.length) {
                return false;
            }
            for (var i = 0; i < this.scopes_requested.length; i++) {
                if (scope === this.scopes_requested[i]) {
                    return true;
                }
            }
            return false;
        },

        /*
         * Returns an array with API Gatekeeper IDs represented by scopes found in 
         * scopes_requested.
         */
        // "getAPIscopes": function() {
        //     var apis = {},
        //         api;
        //     if (!this.scopes_requested) {
        //         return apis;
        //     }
        //     if (!this.scopes_requested.length) {
        //         return apis;
        //     }
        //     for (var i = 0; i < this.scopes_requested.length; i++) {
        //         api = APIGK.getAPIfromScope(this.scopes_requested[i]);
        //         if (api !== null) {
        //             apis[api] = true;
        //         }
        //     }
        //     return utils.getKeys(apis);
        // },

        "hasOrgAuthorized": function(realm, scope) {

            // console.error("About to check if has orgauthrizatsion", this.orgauthorization, scope, realm);
            if (!this.orgauthorization) {
                return false;
            }
            if (!this.orgauthorization[realm]) {
                return false;
            }
            for (var i = 0; i < this.orgauthorization[realm].length; i++) {
                if (this.orgauthorization[realm][i] === scope.scope) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Takes a scope definition as input and returns all scopes that is defined in the 
         * scopedef, sorted into available, requested and accepted lists.
         * 
         * @param  {[type]} scopedef Typically a global scope definition.
         * @return {[type]}          [description]
         */
        "getScopes": function(scopedef) {

            var res = {
                "available": [],
                "requested": [],
                "accepted": []
            };

            for (var scope in scopedef) {
                var x = scopedef[scope];
                x.scope = scope;
                if (this.scopeIsAccepted(scope)) {
                    res.accepted.push(x);
                } else if (this.scopeIsRequested(scope)) {
                    res.requested.push(x);
                } else {
                    res.available.push(x);
                }
            }
            return res;
        }

        // "getScopesObjects": function() {
        //     var list = [];
        //     if (!this.scopes) {
        //         return list;
        //     }
        //     for (var i = 0; i < this.scopes.length; i++) {
        //         list.push(new Scope({
        //             "scope": this.scopes[i]
        //         }));
        //     }
        //     return list;
        // }

    });

    return Client;


});