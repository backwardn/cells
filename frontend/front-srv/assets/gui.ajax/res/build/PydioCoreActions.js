(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PydioCoreActions = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Copyright 2007-2020 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUi = require('material-ui');

var _toggleBmNode = require("./toggleBmNode");

var _toggleBmNode2 = _interopRequireDefault(_toggleBmNode);

var BookmarkButton = (function (_React$Component) {
    _inherits(BookmarkButton, _React$Component);

    function BookmarkButton(props) {
        _classCallCheck(this, BookmarkButton);

        _React$Component.call(this, props);
        this.state = this.valueFromNodes(props.nodes);
    }

    BookmarkButton.prototype.valueFromNodes = function valueFromNodes() {
        var nodes = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        var mixed = undefined,
            value = undefined;
        nodes.forEach(function (n) {
            var nVal = n.getMetadata().get('bookmark') === 'true';
            if (value !== undefined && nVal !== value) {
                mixed = true;
            }
            value = nVal;
        });
        return { value: value, mixed: mixed };
    };

    BookmarkButton.prototype.updateValue = function updateValue(value) {
        var _this = this;

        var nodes = this.props.nodes;

        this.setState({ saving: true });
        var proms = [];
        nodes.forEach(function (n) {
            var isBookmarked = n.getMetadata().get('bookmark') === 'true';
            if (value !== isBookmarked) {
                proms.push(_toggleBmNode2['default'](n));
                var overlay = n.getMetadata().get('overlay_class') || '';
                if (value) {
                    n.getMetadata().set('bookmark', 'true');
                    var overlays = overlay.replace('mdi mdi-star', '').split(',');
                    overlays.push('mdi mdi-star');
                    n.getMetadata().set('overlay_class', overlays.join(','));
                } else {
                    n.getMetadata()['delete']('bookmark');
                    n.getMetadata().set('overlay_class', overlay.replace('mdi mdi-star', ''));
                }
                n.notify('node_replaced');
            }
        });
        Promise.all(proms).then(function () {
            window.setTimeout(function () {
                _this.setState({ saving: false });
            }, 250);
            _this.setState(_this.valueFromNodes(nodes));
        })['catch'](function () {
            _this.setState({ saving: false });
        });
    };

    BookmarkButton.prototype.render = function render() {
        var _this2 = this;

        var styles = this.props.styles;
        var _state = this.state;
        var value = _state.value;
        var mixed = _state.mixed;
        var saving = _state.saving;

        var icon = undefined,
            touchValue = undefined,
            tt = undefined,
            disabled = undefined;
        var mm = _pydio2['default'].getInstance().MessageHash;
        if (mixed) {
            icon = 'star-half';
            touchValue = true;
            tt = mm['bookmark.button.tip.mixed'];
        } else if (value) {
            icon = 'star';
            touchValue = false;
            tt = mm['bookmark.button.tip.remove'];
        } else {
            icon = 'star-outline';
            touchValue = true;
            tt = mm['bookmark.button.tip.add'];
        }

        if (saving) {
            icon = 'star-circle';
            tt = mm['bookmark.button.tip.saving'];
            disabled = true;
        }

        return _react2['default'].createElement(_materialUi.IconButton, _extends({ disabled: disabled, iconClassName: 'mdi mdi-' + icon, tooltip: tt, onTouchTap: function () {
                return _this2.updateValue(touchValue);
            } }, styles));
    };

    return BookmarkButton;
})(_react2['default'].Component);

exports['default'] = BookmarkButton;
module.exports = exports['default'];

},{"./toggleBmNode":5,"material-ui":"material-ui","pydio":"pydio","react":"react"}],2:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _globals = require('../globals');

exports['default'] = function () {

    if (_globals.global.Notification) {
        alert(_globals.MessageHash["notification_center.12"]);
        _globals.global.Notification.requestPermission(function (grant) {
            ['default', 'granted', 'denied'].indexOf(grant) === true;
        });
    } else {
        _globals.global.alert(_globals.MessageHash["notification_center.13"]);
    }
};

module.exports = exports['default'];

},{"../globals":9}],3:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _globals = require('../globals');

exports['default'] = function () {

    _globals.pydio.UI.openComponentInModal('PydioCoreActions', 'PasswordDialog', {
        locked: _globals.pydio.user && _globals.pydio.user.lock === 'pass_change'
    });
};

module.exports = exports['default'];

},{"../globals":9}],4:[function(require,module,exports){
"use strict";

/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

},{}],5:[function(require,module,exports){
/*
 * Copyright 2007-2020 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */
'use strict';

exports.__esModule = true;
exports['default'] = toggleBookmarkNode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globals = require("../globals");

var _pydioHttpApi = require('pydio/http/api');

var _pydioHttpApi2 = _interopRequireDefault(_pydioHttpApi);

var _pydioHttpRestApi = require('pydio/http/rest-api');

function toggleBookmarkNode(node, selection) {

    var isBookmarked = node.getMetadata().get('bookmark') === 'true';
    var nodeUuid = node.getMetadata().get('uuid');
    var userId = _globals.pydio.user.id;

    var api = new _pydioHttpRestApi.UserMetaServiceApi(_pydioHttpApi2['default'].getRestClient());
    var request = new _pydioHttpRestApi.IdmUpdateUserMetaRequest();
    if (isBookmarked) {
        var searchRequest = new _pydioHttpRestApi.IdmSearchUserMetaRequest();
        searchRequest.NodeUuids = [nodeUuid];
        searchRequest.Namespace = "bookmark";
        return api.searchUserMeta(searchRequest).then(function (res) {
            if (res.Metadatas && res.Metadatas.length) {
                request.Operation = _pydioHttpRestApi.UpdateUserMetaRequestUserMetaOp.constructFromObject('DELETE');
                request.MetaDatas = res.Metadatas;
                api.updateUserMeta(request).then(function () {
                    if (selection) {
                        selection.requireNodeReload(node);
                    }
                    _globals.pydio.notify("reload-bookmarks");
                });
            }
        });
    } else {
        request.Operation = _pydioHttpRestApi.UpdateUserMetaRequestUserMetaOp.constructFromObject('PUT');
        var userMeta = new _pydioHttpRestApi.IdmUserMeta();
        userMeta.NodeUuid = nodeUuid;
        userMeta.Namespace = "bookmark";
        userMeta.JsonValue = "\"true\"";
        userMeta.Policies = [_pydioHttpRestApi.ServiceResourcePolicy.constructFromObject({ Resource: nodeUuid, Action: 'OWNER', Subject: 'user:' + userId, Effect: 'allow' }), _pydioHttpRestApi.ServiceResourcePolicy.constructFromObject({ Resource: nodeUuid, Action: 'READ', Subject: 'user:' + userId, Effect: 'allow' }), _pydioHttpRestApi.ServiceResourcePolicy.constructFromObject({ Resource: nodeUuid, Action: 'WRITE', Subject: 'user:' + userId, Effect: 'allow' })];
        request.MetaDatas = [userMeta];
        return api.updateUserMeta(request).then(function () {
            if (selection) {
                selection.requireNodeReload(node);
            }
            _globals.pydio.notify("reload-bookmarks");
        });
    }
}

module.exports = exports['default'];

},{"../globals":9,"pydio/http/api":"pydio/http/api","pydio/http/rest-api":"pydio/http/rest-api"}],6:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globals = require('../globals');

var _toggleBmNode = require('./toggleBmNode');

var _toggleBmNode2 = _interopRequireDefault(_toggleBmNode);

exports['default'] = function () {
    var selection = _globals.pydio.getContextHolder();
    if (selection.isEmpty() || !selection.isUnique()) {
        return;
    }
    _toggleBmNode2['default'](selection.getUniqueNode(), selection);
};

module.exports = exports['default'];

},{"../globals":9,"./toggleBmNode":5}],7:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _globals = require('../globals');

var _materialUi = require('material-ui');

var React = require('react');
var PydioApi = require('pydio/http/api');
var BootUI = require('pydio/http/resources-manager').requireLib('boot');
var ActionDialogMixin = BootUI.ActionDialogMixin;
var SubmitButtonProviderMixin = BootUI.SubmitButtonProviderMixin;
var CancelButtonProviderMixin = BootUI.CancelButtonProviderMixin;
var AsyncComponent = BootUI.AsyncComponent;

var PasswordDialog = React.createClass({
    displayName: 'PasswordDialog',

    mixins: [ActionDialogMixin],
    getInitialState: function getInitialState() {
        return { passValid: false };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            dialogTitle: _globals.pydio.MessageHash[194],
            dialogIsModal: true,
            dialogSize: 'sm'
        };
    },
    getButtons: function getButtons() {
        var _this = this;

        var updater = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        if (updater) this._updater = updater;
        var buttons = [];
        if (!this.props.locked) {
            buttons.push(React.createElement(_materialUi.FlatButton, { label: this.props.pydio.MessageHash[49], onTouchTap: function () {
                    return _this.dismiss();
                } }));
        }
        buttons.push(React.createElement(_materialUi.FlatButton, { label: this.props.pydio.MessageHash[48], onTouchTap: this.submit.bind(this), disabled: !this.state.passValid }));
        return buttons;
    },

    submit: function submit() {
        if (!this.state.passValid) {
            return false;
        }
        this.refs.passwordForm.instance.post((function (value) {
            if (value) this.dismiss();
        }).bind(this));
    },
    passValidStatusChange: function passValidStatusChange(status) {
        var _this2 = this;

        this.setState({ passValid: status }, function () {
            _this2._updater(_this2.getButtons());
        });
    },

    render: function render() {

        return React.createElement(AsyncComponent, {
            namespace: 'UserAccount',
            componentName: 'PasswordForm',
            pydio: this.props.pydio,
            ref: 'passwordForm',
            onValidStatusChange: this.passValidStatusChange
        });
    }

});

exports['default'] = PasswordDialog;
module.exports = exports['default'];

},{"../globals":9,"material-ui":"material-ui","pydio/http/api":"pydio/http/api","pydio/http/resources-manager":"pydio/http/resources-manager","react":"react"}],8:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

"use strict";

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _pydio = require("pydio");

var _pydio2 = _interopRequireDefault(_pydio);

var _materialUi = require('material-ui');

var _reactMarkdown = require("react-markdown");

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

var _Pydio$requireLib = _pydio2["default"].requireLib('boot');

var ActionDialogMixin = _Pydio$requireLib.ActionDialogMixin;
var SubmitButtonProviderMixin = _Pydio$requireLib.SubmitButtonProviderMixin;
var Loader = _Pydio$requireLib.Loader;

var SplashDialog = _react2["default"].createClass({
    displayName: "SplashDialog",

    mixins: [ActionDialogMixin, SubmitButtonProviderMixin],

    getDefaultProps: function getDefaultProps() {
        return {
            dialogTitle: '',
            dialogSize: 'lg',
            dialogIsModal: false,
            dialogPadding: false,
            dialogScrollBody: true
        };
    },
    submit: function submit() {
        this.dismiss();
    },

    openDocs: function openDocs() {
        open("https://pydio.com/en/docs");
    },

    openForum: function openForum() {
        open("https://forum.pydio.com");
    },

    openGithub: function openGithub() {
        open("https://github.com/pydio/cells/issues");
    },

    getInitialState: function getInitialState() {
        return { aboutContent: null };
    },

    componentDidMount: function componentDidMount() {
        var _this = this;

        var url = pydio.Parameters.get('FRONTEND_URL') + '/plug/gui.ajax/credits.md';
        window.fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        }).then(function (response) {
            response.text().then(function (data) {
                _this.setState({ aboutContent: data });
            });
        });
    },

    render: function render() {
        var credit = undefined;
        if (this.state.aboutContent) {
            credit = _react2["default"].createElement(_reactMarkdown2["default"], { source: this.state.aboutContent });
        } else {
            credit = _react2["default"].createElement(Loader, { style: { minHeight: 200 } });
        }
        credit = _react2["default"].createElement(
            _materialUi.Card,
            { style: { margin: 10 } },
            _react2["default"].createElement(_materialUi.CardTitle, {
                title: pydio.Parameters.get('backend')['PackageLabel'],
                subtitle: "Details about version, licensing and how to get help"
            }),
            _react2["default"].createElement(_materialUi.Divider, null),
            _react2["default"].createElement(
                _materialUi.CardActions,
                null,
                _react2["default"].createElement(_materialUi.FlatButton, { primary: true, icon: _react2["default"].createElement(_materialUi.FontIcon, { className: "mdi mdi-book-variant" }), label: "Docs", onTouchTap: this.openDocs }),
                _react2["default"].createElement(_materialUi.FlatButton, { primary: true, icon: _react2["default"].createElement(_materialUi.FontIcon, { className: "mdi mdi-slack" }), label: "Forums", onTouchTap: this.openForum }),
                _react2["default"].createElement(_materialUi.FlatButton, { primary: true, icon: _react2["default"].createElement(_materialUi.FontIcon, { className: "mdi mdi-github-box" }), label: "Issues", onTouchTap: this.openGithub })
            ),
            _react2["default"].createElement(_materialUi.Divider, null),
            _react2["default"].createElement(
                _materialUi.CardText,
                null,
                credit
            )
        );
        return _react2["default"].createElement(
            "div",
            { style: { height: '100%', backgroundColor: '#CFD8DC' } },
            credit
        );
    }

});

exports["default"] = SplashDialog;
module.exports = exports["default"];

},{"material-ui":"material-ui","pydio":"pydio","react":"react","react-markdown":"react-markdown"}],9:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

"use strict";

exports.__esModule = true;
var global = window;
var pydio = global.pydio;
var MessageHash = pydio.MessageHash;
exports.global = global;
exports.pydio = pydio;
exports.MessageHash = MessageHash;

},{}],10:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dialogSplashDialog = require('./dialog/SplashDialog');

var _dialogSplashDialog2 = _interopRequireDefault(_dialogSplashDialog);

var _dialogPasswordDialog = require('./dialog/PasswordDialog');

var _dialogPasswordDialog2 = _interopRequireDefault(_dialogPasswordDialog);

var _callbacksBookmarkButton = require('./callbacks/BookmarkButton');

var _callbacksBookmarkButton2 = _interopRequireDefault(_callbacksBookmarkButton);

var Callbacks = {
    switchLanguage: require('./callbacks/switchLanguage'),
    changePass: require('./callbacks/changePass'),
    toggleBookmark: require('./callbacks/toggleBookmark'),
    activateDesktopNotifications: require('./callbacks/activateDesktopNotifications')
};

var Navigation = {
    splash: require('./navigation/splash'),
    up: require('./navigation/up'),
    refresh: require('./navigation/refresh'),
    externalSelection: require('./navigation/externalSelection'),
    openGoPro: require('./navigation/openGoPro'),
    switchToSettings: require('./navigation/switchToSettings'),
    switchToHomepage: require('./navigation/switchToHomepage')
};

exports.Callbacks = Callbacks;
exports.Navigation = Navigation;
exports.SplashDialog = _dialogSplashDialog2['default'];
exports.PasswordDialog = _dialogPasswordDialog2['default'];
exports.BookmarkButton = _callbacksBookmarkButton2['default'];

},{"./callbacks/BookmarkButton":1,"./callbacks/activateDesktopNotifications":2,"./callbacks/changePass":3,"./callbacks/switchLanguage":4,"./callbacks/toggleBookmark":6,"./dialog/PasswordDialog":7,"./dialog/SplashDialog":8,"./navigation/externalSelection":11,"./navigation/openGoPro":12,"./navigation/refresh":13,"./navigation/splash":14,"./navigation/switchToHomepage":15,"./navigation/switchToSettings":16,"./navigation/up":17}],11:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _globals = require('../globals');

exports['default'] = function () {

    var userSelection = _globals.pydio.getUserSelection();
    if (userSelection.isUnique() && !userSelection.hasDir()) {
        var fileName = userSelection.getUniqueFileName();
        var selectorData = _globals.pydio.getController().selectorData;
        if (selectorData.get('type') == "ckeditor") {
            var ckData = selectorData.get('data');
            if (ckData['CKEditorFuncNum']) {
                var imagePath = fileName;
                if (ckData['relative_path']) {
                    imagePath = ckData['relative_path'] + fileName;
                }
                _globals.global.opener.CKEDITOR.tools.callFunction(ckData['CKEditorFuncNum'], imagePath);
                _globals.global.close();
            }
        }
    }
};

module.exports = exports['default'];

},{"../globals":9}],12:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _globals = require('../globals');

exports['default'] = function () {
  _globals.global.open('https://pydio.com/en/go-pro?referrer=settings');
};

module.exports = exports['default'];

},{"../globals":9}],13:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _globals = require('../globals');

exports['default'] = function () {

  _globals.pydio.fireContextRefresh();
};

module.exports = exports['default'];

},{"../globals":9}],14:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _globals = require('../globals');

exports['default'] = function () {

  _globals.pydio.UI.openComponentInModal('PydioCoreActions', 'SplashDialog');
};

module.exports = exports['default'];

},{"../globals":9}],15:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _globals = require('../globals');

exports['default'] = function () {

    if (!_globals.pydio.repositoryId || _globals.pydio.repositoryId !== "homepage") {
        _globals.pydio.triggerRepositoryChange('homepage');
    }
};

module.exports = exports['default'];

},{"../globals":9}],16:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _globals = require('../globals');

exports['default'] = function () {

    if (!_globals.pydio.repositoryId || _globals.pydio.repositoryId !== "settings") {
        _globals.pydio.triggerRepositoryChange('settings');
    }
};

module.exports = exports['default'];

},{"../globals":9}],17:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _globals = require('../globals');

exports['default'] = function () {

  _globals.pydio.fireContextUp();
};

module.exports = exports['default'];

},{"../globals":9}]},{},[10])(10)
});

//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJyZXMvYnVpbGQvdWkvQ29yZUFjdGlvbnMvY2FsbGJhY2tzL0Jvb2ttYXJrQnV0dG9uLmpzIiwicmVzL2J1aWxkL3VpL0NvcmVBY3Rpb25zL2NhbGxiYWNrcy9hY3RpdmF0ZURlc2t0b3BOb3RpZmljYXRpb25zLmpzIiwicmVzL2J1aWxkL3VpL0NvcmVBY3Rpb25zL2NhbGxiYWNrcy9jaGFuZ2VQYXNzLmpzIiwicmVzL2J1aWxkL3VpL0NvcmVBY3Rpb25zL2NhbGxiYWNrcy9zd2l0Y2hMYW5ndWFnZS5qcyIsInJlcy9idWlsZC91aS9Db3JlQWN0aW9ucy9jYWxsYmFja3MvdG9nZ2xlQm1Ob2RlLmpzIiwicmVzL2J1aWxkL3VpL0NvcmVBY3Rpb25zL2NhbGxiYWNrcy90b2dnbGVCb29rbWFyay5qcyIsInJlcy9idWlsZC91aS9Db3JlQWN0aW9ucy9kaWFsb2cvUGFzc3dvcmREaWFsb2cuanMiLCJyZXMvYnVpbGQvdWkvQ29yZUFjdGlvbnMvZGlhbG9nL1NwbGFzaERpYWxvZy5qcyIsInJlcy9idWlsZC91aS9Db3JlQWN0aW9ucy9nbG9iYWxzLmpzIiwicmVzL2J1aWxkL3VpL0NvcmVBY3Rpb25zL2luZGV4LmpzIiwicmVzL2J1aWxkL3VpL0NvcmVBY3Rpb25zL25hdmlnYXRpb24vZXh0ZXJuYWxTZWxlY3Rpb24uanMiLCJyZXMvYnVpbGQvdWkvQ29yZUFjdGlvbnMvbmF2aWdhdGlvbi9vcGVuR29Qcm8uanMiLCJyZXMvYnVpbGQvdWkvQ29yZUFjdGlvbnMvbmF2aWdhdGlvbi9yZWZyZXNoLmpzIiwicmVzL2J1aWxkL3VpL0NvcmVBY3Rpb25zL25hdmlnYXRpb24vc3BsYXNoLmpzIiwicmVzL2J1aWxkL3VpL0NvcmVBY3Rpb25zL25hdmlnYXRpb24vc3dpdGNoVG9Ib21lcGFnZS5qcyIsInJlcy9idWlsZC91aS9Db3JlQWN0aW9ucy9uYXZpZ2F0aW9uL3N3aXRjaFRvU2V0dGluZ3MuanMiLCJyZXMvYnVpbGQvdWkvQ29yZUFjdGlvbnMvbmF2aWdhdGlvbi91cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMjAgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX3B5ZGlvID0gcmVxdWlyZSgncHlkaW8nKTtcblxudmFyIF9weWRpbzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9weWRpbyk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9tYXRlcmlhbFVpID0gcmVxdWlyZSgnbWF0ZXJpYWwtdWknKTtcblxudmFyIF90b2dnbGVCbU5vZGUgPSByZXF1aXJlKFwiLi90b2dnbGVCbU5vZGVcIik7XG5cbnZhciBfdG9nZ2xlQm1Ob2RlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RvZ2dsZUJtTm9kZSk7XG5cbnZhciBCb29rbWFya0J1dHRvbiA9IChmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgIF9pbmhlcml0cyhCb29rbWFya0J1dHRvbiwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBCb29rbWFya0J1dHRvbihwcm9wcykge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQm9va21hcmtCdXR0b24pO1xuXG4gICAgICAgIF9SZWFjdCRDb21wb25lbnQuY2FsbCh0aGlzLCBwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnZhbHVlRnJvbU5vZGVzKHByb3BzLm5vZGVzKTtcbiAgICB9XG5cbiAgICBCb29rbWFya0J1dHRvbi5wcm90b3R5cGUudmFsdWVGcm9tTm9kZXMgPSBmdW5jdGlvbiB2YWx1ZUZyb21Ob2RlcygpIHtcbiAgICAgICAgdmFyIG5vZGVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbMF07XG5cbiAgICAgICAgdmFyIG1peGVkID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgICAgIHZhciBuVmFsID0gbi5nZXRNZXRhZGF0YSgpLmdldCgnYm9va21hcmsnKSA9PT0gJ3RydWUnO1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgblZhbCAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBtaXhlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IG5WYWw7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIG1peGVkOiBtaXhlZCB9O1xuICAgIH07XG5cbiAgICBCb29rbWFya0J1dHRvbi5wcm90b3R5cGUudXBkYXRlVmFsdWUgPSBmdW5jdGlvbiB1cGRhdGVWYWx1ZSh2YWx1ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHZhciBub2RlcyA9IHRoaXMucHJvcHMubm9kZXM7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNhdmluZzogdHJ1ZSB9KTtcbiAgICAgICAgdmFyIHByb21zID0gW107XG4gICAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgICAgIHZhciBpc0Jvb2ttYXJrZWQgPSBuLmdldE1ldGFkYXRhKCkuZ2V0KCdib29rbWFyaycpID09PSAndHJ1ZSc7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IGlzQm9va21hcmtlZCkge1xuICAgICAgICAgICAgICAgIHByb21zLnB1c2goX3RvZ2dsZUJtTm9kZTJbJ2RlZmF1bHQnXShuKSk7XG4gICAgICAgICAgICAgICAgdmFyIG92ZXJsYXkgPSBuLmdldE1ldGFkYXRhKCkuZ2V0KCdvdmVybGF5X2NsYXNzJykgfHwgJyc7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG4uZ2V0TWV0YWRhdGEoKS5zZXQoJ2Jvb2ttYXJrJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG92ZXJsYXlzID0gb3ZlcmxheS5yZXBsYWNlKCdtZGkgbWRpLXN0YXInLCAnJykuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheXMucHVzaCgnbWRpIG1kaS1zdGFyJyk7XG4gICAgICAgICAgICAgICAgICAgIG4uZ2V0TWV0YWRhdGEoKS5zZXQoJ292ZXJsYXlfY2xhc3MnLCBvdmVybGF5cy5qb2luKCcsJykpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG4uZ2V0TWV0YWRhdGEoKVsnZGVsZXRlJ10oJ2Jvb2ttYXJrJyk7XG4gICAgICAgICAgICAgICAgICAgIG4uZ2V0TWV0YWRhdGEoKS5zZXQoJ292ZXJsYXlfY2xhc3MnLCBvdmVybGF5LnJlcGxhY2UoJ21kaSBtZGktc3RhcicsICcnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG4ubm90aWZ5KCdub2RlX3JlcGxhY2VkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBQcm9taXNlLmFsbChwcm9tcykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0U3RhdGUoeyBzYXZpbmc6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICAgIF90aGlzLnNldFN0YXRlKF90aGlzLnZhbHVlRnJvbU5vZGVzKG5vZGVzKSk7XG4gICAgICAgIH0pWydjYXRjaCddKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLnNldFN0YXRlKHsgc2F2aW5nOiBmYWxzZSB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEJvb2ttYXJrQnV0dG9uLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgIHZhciBzdHlsZXMgPSB0aGlzLnByb3BzLnN0eWxlcztcbiAgICAgICAgdmFyIF9zdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHZhciB2YWx1ZSA9IF9zdGF0ZS52YWx1ZTtcbiAgICAgICAgdmFyIG1peGVkID0gX3N0YXRlLm1peGVkO1xuICAgICAgICB2YXIgc2F2aW5nID0gX3N0YXRlLnNhdmluZztcblxuICAgICAgICB2YXIgaWNvbiA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRvdWNoVmFsdWUgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICB0dCA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRpc2FibGVkID0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgbW0gPSBfcHlkaW8yWydkZWZhdWx0J10uZ2V0SW5zdGFuY2UoKS5NZXNzYWdlSGFzaDtcbiAgICAgICAgaWYgKG1peGVkKSB7XG4gICAgICAgICAgICBpY29uID0gJ3N0YXItaGFsZic7XG4gICAgICAgICAgICB0b3VjaFZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIHR0ID0gbW1bJ2Jvb2ttYXJrLmJ1dHRvbi50aXAubWl4ZWQnXTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgaWNvbiA9ICdzdGFyJztcbiAgICAgICAgICAgIHRvdWNoVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHR0ID0gbW1bJ2Jvb2ttYXJrLmJ1dHRvbi50aXAucmVtb3ZlJ107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpY29uID0gJ3N0YXItb3V0bGluZSc7XG4gICAgICAgICAgICB0b3VjaFZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIHR0ID0gbW1bJ2Jvb2ttYXJrLmJ1dHRvbi50aXAuYWRkJ107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2F2aW5nKSB7XG4gICAgICAgICAgICBpY29uID0gJ3N0YXItY2lyY2xlJztcbiAgICAgICAgICAgIHR0ID0gbW1bJ2Jvb2ttYXJrLmJ1dHRvbi50aXAuc2F2aW5nJ107XG4gICAgICAgICAgICBkaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoX21hdGVyaWFsVWkuSWNvbkJ1dHRvbiwgX2V4dGVuZHMoeyBkaXNhYmxlZDogZGlzYWJsZWQsIGljb25DbGFzc05hbWU6ICdtZGkgbWRpLScgKyBpY29uLCB0b29sdGlwOiB0dCwgb25Ub3VjaFRhcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczIudXBkYXRlVmFsdWUodG91Y2hWYWx1ZSk7XG4gICAgICAgICAgICB9IH0sIHN0eWxlcykpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQm9va21hcmtCdXR0b247XG59KShfcmVhY3QyWydkZWZhdWx0J10uQ29tcG9uZW50KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gQm9va21hcmtCdXR0b247XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE3IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2dsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIGlmIChfZ2xvYmFscy5nbG9iYWwuTm90aWZpY2F0aW9uKSB7XG4gICAgICAgIGFsZXJ0KF9nbG9iYWxzLk1lc3NhZ2VIYXNoW1wibm90aWZpY2F0aW9uX2NlbnRlci4xMlwiXSk7XG4gICAgICAgIF9nbG9iYWxzLmdsb2JhbC5Ob3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oZnVuY3Rpb24gKGdyYW50KSB7XG4gICAgICAgICAgICBbJ2RlZmF1bHQnLCAnZ3JhbnRlZCcsICdkZW5pZWQnXS5pbmRleE9mKGdyYW50KSA9PT0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgX2dsb2JhbHMuZ2xvYmFsLmFsZXJ0KF9nbG9iYWxzLk1lc3NhZ2VIYXNoW1wibm90aWZpY2F0aW9uX2NlbnRlci4xM1wiXSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9nbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBfZ2xvYmFscy5weWRpby5VSS5vcGVuQ29tcG9uZW50SW5Nb2RhbCgnUHlkaW9Db3JlQWN0aW9ucycsICdQYXNzd29yZERpYWxvZycsIHtcbiAgICAgICAgbG9ja2VkOiBfZ2xvYmFscy5weWRpby51c2VyICYmIF9nbG9iYWxzLnB5ZGlvLnVzZXIubG9jayA9PT0gJ3Bhc3NfY2hhbmdlJ1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMjAgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gdG9nZ2xlQm9va21hcmtOb2RlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfZ2xvYmFscyA9IHJlcXVpcmUoXCIuLi9nbG9iYWxzXCIpO1xuXG52YXIgX3B5ZGlvSHR0cEFwaSA9IHJlcXVpcmUoJ3B5ZGlvL2h0dHAvYXBpJyk7XG5cbnZhciBfcHlkaW9IdHRwQXBpMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3B5ZGlvSHR0cEFwaSk7XG5cbnZhciBfcHlkaW9IdHRwUmVzdEFwaSA9IHJlcXVpcmUoJ3B5ZGlvL2h0dHAvcmVzdC1hcGknKTtcblxuZnVuY3Rpb24gdG9nZ2xlQm9va21hcmtOb2RlKG5vZGUsIHNlbGVjdGlvbikge1xuXG4gICAgdmFyIGlzQm9va21hcmtlZCA9IG5vZGUuZ2V0TWV0YWRhdGEoKS5nZXQoJ2Jvb2ttYXJrJykgPT09ICd0cnVlJztcbiAgICB2YXIgbm9kZVV1aWQgPSBub2RlLmdldE1ldGFkYXRhKCkuZ2V0KCd1dWlkJyk7XG4gICAgdmFyIHVzZXJJZCA9IF9nbG9iYWxzLnB5ZGlvLnVzZXIuaWQ7XG5cbiAgICB2YXIgYXBpID0gbmV3IF9weWRpb0h0dHBSZXN0QXBpLlVzZXJNZXRhU2VydmljZUFwaShfcHlkaW9IdHRwQXBpMlsnZGVmYXVsdCddLmdldFJlc3RDbGllbnQoKSk7XG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgX3B5ZGlvSHR0cFJlc3RBcGkuSWRtVXBkYXRlVXNlck1ldGFSZXF1ZXN0KCk7XG4gICAgaWYgKGlzQm9va21hcmtlZCkge1xuICAgICAgICB2YXIgc2VhcmNoUmVxdWVzdCA9IG5ldyBfcHlkaW9IdHRwUmVzdEFwaS5JZG1TZWFyY2hVc2VyTWV0YVJlcXVlc3QoKTtcbiAgICAgICAgc2VhcmNoUmVxdWVzdC5Ob2RlVXVpZHMgPSBbbm9kZVV1aWRdO1xuICAgICAgICBzZWFyY2hSZXF1ZXN0Lk5hbWVzcGFjZSA9IFwiYm9va21hcmtcIjtcbiAgICAgICAgcmV0dXJuIGFwaS5zZWFyY2hVc2VyTWV0YShzZWFyY2hSZXF1ZXN0KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIGlmIChyZXMuTWV0YWRhdGFzICYmIHJlcy5NZXRhZGF0YXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5PcGVyYXRpb24gPSBfcHlkaW9IdHRwUmVzdEFwaS5VcGRhdGVVc2VyTWV0YVJlcXVlc3RVc2VyTWV0YU9wLmNvbnN0cnVjdEZyb21PYmplY3QoJ0RFTEVURScpO1xuICAgICAgICAgICAgICAgIHJlcXVlc3QuTWV0YURhdGFzID0gcmVzLk1ldGFkYXRhcztcbiAgICAgICAgICAgICAgICBhcGkudXBkYXRlVXNlck1ldGEocmVxdWVzdCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5yZXF1aXJlTm9kZVJlbG9hZChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfZ2xvYmFscy5weWRpby5ub3RpZnkoXCJyZWxvYWQtYm9va21hcmtzXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0Lk9wZXJhdGlvbiA9IF9weWRpb0h0dHBSZXN0QXBpLlVwZGF0ZVVzZXJNZXRhUmVxdWVzdFVzZXJNZXRhT3AuY29uc3RydWN0RnJvbU9iamVjdCgnUFVUJyk7XG4gICAgICAgIHZhciB1c2VyTWV0YSA9IG5ldyBfcHlkaW9IdHRwUmVzdEFwaS5JZG1Vc2VyTWV0YSgpO1xuICAgICAgICB1c2VyTWV0YS5Ob2RlVXVpZCA9IG5vZGVVdWlkO1xuICAgICAgICB1c2VyTWV0YS5OYW1lc3BhY2UgPSBcImJvb2ttYXJrXCI7XG4gICAgICAgIHVzZXJNZXRhLkpzb25WYWx1ZSA9IFwiXFxcInRydWVcXFwiXCI7XG4gICAgICAgIHVzZXJNZXRhLlBvbGljaWVzID0gW19weWRpb0h0dHBSZXN0QXBpLlNlcnZpY2VSZXNvdXJjZVBvbGljeS5jb25zdHJ1Y3RGcm9tT2JqZWN0KHsgUmVzb3VyY2U6IG5vZGVVdWlkLCBBY3Rpb246ICdPV05FUicsIFN1YmplY3Q6ICd1c2VyOicgKyB1c2VySWQsIEVmZmVjdDogJ2FsbG93JyB9KSwgX3B5ZGlvSHR0cFJlc3RBcGkuU2VydmljZVJlc291cmNlUG9saWN5LmNvbnN0cnVjdEZyb21PYmplY3QoeyBSZXNvdXJjZTogbm9kZVV1aWQsIEFjdGlvbjogJ1JFQUQnLCBTdWJqZWN0OiAndXNlcjonICsgdXNlcklkLCBFZmZlY3Q6ICdhbGxvdycgfSksIF9weWRpb0h0dHBSZXN0QXBpLlNlcnZpY2VSZXNvdXJjZVBvbGljeS5jb25zdHJ1Y3RGcm9tT2JqZWN0KHsgUmVzb3VyY2U6IG5vZGVVdWlkLCBBY3Rpb246ICdXUklURScsIFN1YmplY3Q6ICd1c2VyOicgKyB1c2VySWQsIEVmZmVjdDogJ2FsbG93JyB9KV07XG4gICAgICAgIHJlcXVlc3QuTWV0YURhdGFzID0gW3VzZXJNZXRhXTtcbiAgICAgICAgcmV0dXJuIGFwaS51cGRhdGVVc2VyTWV0YShyZXF1ZXN0KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24ucmVxdWlyZU5vZGVSZWxvYWQobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfZ2xvYmFscy5weWRpby5ub3RpZnkoXCJyZWxvYWQtYm9va21hcmtzXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIF90b2dnbGVCbU5vZGUgPSByZXF1aXJlKCcuL3RvZ2dsZUJtTm9kZScpO1xuXG52YXIgX3RvZ2dsZUJtTm9kZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90b2dnbGVCbU5vZGUpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGVjdGlvbiA9IF9nbG9iYWxzLnB5ZGlvLmdldENvbnRleHRIb2xkZXIoKTtcbiAgICBpZiAoc2VsZWN0aW9uLmlzRW1wdHkoKSB8fCAhc2VsZWN0aW9uLmlzVW5pcXVlKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBfdG9nZ2xlQm1Ob2RlMlsnZGVmYXVsdCddKHNlbGVjdGlvbi5nZXRVbmlxdWVOb2RlKCksIHNlbGVjdGlvbik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE3IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2dsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciBfbWF0ZXJpYWxVaSA9IHJlcXVpcmUoJ21hdGVyaWFsLXVpJyk7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHlkaW9BcGkgPSByZXF1aXJlKCdweWRpby9odHRwL2FwaScpO1xudmFyIEJvb3RVSSA9IHJlcXVpcmUoJ3B5ZGlvL2h0dHAvcmVzb3VyY2VzLW1hbmFnZXInKS5yZXF1aXJlTGliKCdib290Jyk7XG52YXIgQWN0aW9uRGlhbG9nTWl4aW4gPSBCb290VUkuQWN0aW9uRGlhbG9nTWl4aW47XG52YXIgU3VibWl0QnV0dG9uUHJvdmlkZXJNaXhpbiA9IEJvb3RVSS5TdWJtaXRCdXR0b25Qcm92aWRlck1peGluO1xudmFyIENhbmNlbEJ1dHRvblByb3ZpZGVyTWl4aW4gPSBCb290VUkuQ2FuY2VsQnV0dG9uUHJvdmlkZXJNaXhpbjtcbnZhciBBc3luY0NvbXBvbmVudCA9IEJvb3RVSS5Bc3luY0NvbXBvbmVudDtcblxudmFyIFBhc3N3b3JkRGlhbG9nID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnUGFzc3dvcmREaWFsb2cnLFxuXG4gICAgbWl4aW5zOiBbQWN0aW9uRGlhbG9nTWl4aW5dLFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgICAgICByZXR1cm4geyBwYXNzVmFsaWQ6IGZhbHNlIH07XG4gICAgfSxcbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRpYWxvZ1RpdGxlOiBfZ2xvYmFscy5weWRpby5NZXNzYWdlSGFzaFsxOTRdLFxuICAgICAgICAgICAgZGlhbG9nSXNNb2RhbDogdHJ1ZSxcbiAgICAgICAgICAgIGRpYWxvZ1NpemU6ICdzbSdcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIGdldEJ1dHRvbnM6IGZ1bmN0aW9uIGdldEJ1dHRvbnMoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHVwZGF0ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBudWxsIDogYXJndW1lbnRzWzBdO1xuXG4gICAgICAgIGlmICh1cGRhdGVyKSB0aGlzLl91cGRhdGVyID0gdXBkYXRlcjtcbiAgICAgICAgdmFyIGJ1dHRvbnMgPSBbXTtcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmxvY2tlZCkge1xuICAgICAgICAgICAgYnV0dG9ucy5wdXNoKFJlYWN0LmNyZWF0ZUVsZW1lbnQoX21hdGVyaWFsVWkuRmxhdEJ1dHRvbiwgeyBsYWJlbDogdGhpcy5wcm9wcy5weWRpby5NZXNzYWdlSGFzaFs0OV0sIG9uVG91Y2hUYXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgICB9IH0pKTtcbiAgICAgICAgfVxuICAgICAgICBidXR0b25zLnB1c2goUmVhY3QuY3JlYXRlRWxlbWVudChfbWF0ZXJpYWxVaS5GbGF0QnV0dG9uLCB7IGxhYmVsOiB0aGlzLnByb3BzLnB5ZGlvLk1lc3NhZ2VIYXNoWzQ4XSwgb25Ub3VjaFRhcDogdGhpcy5zdWJtaXQuYmluZCh0aGlzKSwgZGlzYWJsZWQ6ICF0aGlzLnN0YXRlLnBhc3NWYWxpZCB9KSk7XG4gICAgICAgIHJldHVybiBidXR0b25zO1xuICAgIH0sXG5cbiAgICBzdWJtaXQ6IGZ1bmN0aW9uIHN1Ym1pdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnBhc3NWYWxpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVmcy5wYXNzd29yZEZvcm0uaW5zdGFuY2UucG9zdCgoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHRoaXMuZGlzbWlzcygpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuICAgIHBhc3NWYWxpZFN0YXR1c0NoYW5nZTogZnVuY3Rpb24gcGFzc1ZhbGlkU3RhdHVzQ2hhbmdlKHN0YXR1cykge1xuICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcGFzc1ZhbGlkOiBzdGF0dXMgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMyLl91cGRhdGVyKF90aGlzMi5nZXRCdXR0b25zKCkpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXN5bmNDb21wb25lbnQsIHtcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJ1VzZXJBY2NvdW50JyxcbiAgICAgICAgICAgIGNvbXBvbmVudE5hbWU6ICdQYXNzd29yZEZvcm0nLFxuICAgICAgICAgICAgcHlkaW86IHRoaXMucHJvcHMucHlkaW8sXG4gICAgICAgICAgICByZWY6ICdwYXNzd29yZEZvcm0nLFxuICAgICAgICAgICAgb25WYWxpZFN0YXR1c0NoYW5nZTogdGhpcy5wYXNzVmFsaWRTdGF0dXNDaGFuZ2VcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gUGFzc3dvcmREaWFsb2c7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE3IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG52YXIgX3JlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9weWRpbyA9IHJlcXVpcmUoXCJweWRpb1wiKTtcblxudmFyIF9weWRpbzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9weWRpbyk7XG5cbnZhciBfbWF0ZXJpYWxVaSA9IHJlcXVpcmUoJ21hdGVyaWFsLXVpJyk7XG5cbnZhciBfcmVhY3RNYXJrZG93biA9IHJlcXVpcmUoXCJyZWFjdC1tYXJrZG93blwiKTtcblxudmFyIF9yZWFjdE1hcmtkb3duMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0TWFya2Rvd24pO1xuXG52YXIgX1B5ZGlvJHJlcXVpcmVMaWIgPSBfcHlkaW8yW1wiZGVmYXVsdFwiXS5yZXF1aXJlTGliKCdib290Jyk7XG5cbnZhciBBY3Rpb25EaWFsb2dNaXhpbiA9IF9QeWRpbyRyZXF1aXJlTGliLkFjdGlvbkRpYWxvZ01peGluO1xudmFyIFN1Ym1pdEJ1dHRvblByb3ZpZGVyTWl4aW4gPSBfUHlkaW8kcmVxdWlyZUxpYi5TdWJtaXRCdXR0b25Qcm92aWRlck1peGluO1xudmFyIExvYWRlciA9IF9QeWRpbyRyZXF1aXJlTGliLkxvYWRlcjtcblxudmFyIFNwbGFzaERpYWxvZyA9IF9yZWFjdDJbXCJkZWZhdWx0XCJdLmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogXCJTcGxhc2hEaWFsb2dcIixcblxuICAgIG1peGluczogW0FjdGlvbkRpYWxvZ01peGluLCBTdWJtaXRCdXR0b25Qcm92aWRlck1peGluXSxcblxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGlhbG9nVGl0bGU6ICcnLFxuICAgICAgICAgICAgZGlhbG9nU2l6ZTogJ2xnJyxcbiAgICAgICAgICAgIGRpYWxvZ0lzTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgZGlhbG9nUGFkZGluZzogZmFsc2UsXG4gICAgICAgICAgICBkaWFsb2dTY3JvbGxCb2R5OiB0cnVlXG4gICAgICAgIH07XG4gICAgfSxcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uIHN1Ym1pdCgpIHtcbiAgICAgICAgdGhpcy5kaXNtaXNzKCk7XG4gICAgfSxcblxuICAgIG9wZW5Eb2NzOiBmdW5jdGlvbiBvcGVuRG9jcygpIHtcbiAgICAgICAgb3BlbihcImh0dHBzOi8vcHlkaW8uY29tL2VuL2RvY3NcIik7XG4gICAgfSxcblxuICAgIG9wZW5Gb3J1bTogZnVuY3Rpb24gb3BlbkZvcnVtKCkge1xuICAgICAgICBvcGVuKFwiaHR0cHM6Ly9mb3J1bS5weWRpby5jb21cIik7XG4gICAgfSxcblxuICAgIG9wZW5HaXRodWI6IGZ1bmN0aW9uIG9wZW5HaXRodWIoKSB7XG4gICAgICAgIG9wZW4oXCJodHRwczovL2dpdGh1Yi5jb20vcHlkaW8vY2VsbHMvaXNzdWVzXCIpO1xuICAgIH0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHsgYWJvdXRDb250ZW50OiBudWxsIH07XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB2YXIgdXJsID0gcHlkaW8uUGFyYW1ldGVycy5nZXQoJ0ZST05URU5EX1VSTCcpICsgJy9wbHVnL2d1aS5hamF4L2NyZWRpdHMubWQnO1xuICAgICAgICB3aW5kb3cuZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlLnRleHQoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0U3RhdGUoeyBhYm91dENvbnRlbnQ6IGRhdGEgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICB2YXIgY3JlZGl0ID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5hYm91dENvbnRlbnQpIHtcbiAgICAgICAgICAgIGNyZWRpdCA9IF9yZWFjdDJbXCJkZWZhdWx0XCJdLmNyZWF0ZUVsZW1lbnQoX3JlYWN0TWFya2Rvd24yW1wiZGVmYXVsdFwiXSwgeyBzb3VyY2U6IHRoaXMuc3RhdGUuYWJvdXRDb250ZW50IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3JlZGl0ID0gX3JlYWN0MltcImRlZmF1bHRcIl0uY3JlYXRlRWxlbWVudChMb2FkZXIsIHsgc3R5bGU6IHsgbWluSGVpZ2h0OiAyMDAgfSB9KTtcbiAgICAgICAgfVxuICAgICAgICBjcmVkaXQgPSBfcmVhY3QyW1wiZGVmYXVsdFwiXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgX21hdGVyaWFsVWkuQ2FyZCxcbiAgICAgICAgICAgIHsgc3R5bGU6IHsgbWFyZ2luOiAxMCB9IH0sXG4gICAgICAgICAgICBfcmVhY3QyW1wiZGVmYXVsdFwiXS5jcmVhdGVFbGVtZW50KF9tYXRlcmlhbFVpLkNhcmRUaXRsZSwge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBweWRpby5QYXJhbWV0ZXJzLmdldCgnYmFja2VuZCcpWydQYWNrYWdlTGFiZWwnXSxcbiAgICAgICAgICAgICAgICBzdWJ0aXRsZTogXCJEZXRhaWxzIGFib3V0IHZlcnNpb24sIGxpY2Vuc2luZyBhbmQgaG93IHRvIGdldCBoZWxwXCJcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgX3JlYWN0MltcImRlZmF1bHRcIl0uY3JlYXRlRWxlbWVudChfbWF0ZXJpYWxVaS5EaXZpZGVyLCBudWxsKSxcbiAgICAgICAgICAgIF9yZWFjdDJbXCJkZWZhdWx0XCJdLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgX21hdGVyaWFsVWkuQ2FyZEFjdGlvbnMsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBfcmVhY3QyW1wiZGVmYXVsdFwiXS5jcmVhdGVFbGVtZW50KF9tYXRlcmlhbFVpLkZsYXRCdXR0b24sIHsgcHJpbWFyeTogdHJ1ZSwgaWNvbjogX3JlYWN0MltcImRlZmF1bHRcIl0uY3JlYXRlRWxlbWVudChfbWF0ZXJpYWxVaS5Gb250SWNvbiwgeyBjbGFzc05hbWU6IFwibWRpIG1kaS1ib29rLXZhcmlhbnRcIiB9KSwgbGFiZWw6IFwiRG9jc1wiLCBvblRvdWNoVGFwOiB0aGlzLm9wZW5Eb2NzIH0pLFxuICAgICAgICAgICAgICAgIF9yZWFjdDJbXCJkZWZhdWx0XCJdLmNyZWF0ZUVsZW1lbnQoX21hdGVyaWFsVWkuRmxhdEJ1dHRvbiwgeyBwcmltYXJ5OiB0cnVlLCBpY29uOiBfcmVhY3QyW1wiZGVmYXVsdFwiXS5jcmVhdGVFbGVtZW50KF9tYXRlcmlhbFVpLkZvbnRJY29uLCB7IGNsYXNzTmFtZTogXCJtZGkgbWRpLXNsYWNrXCIgfSksIGxhYmVsOiBcIkZvcnVtc1wiLCBvblRvdWNoVGFwOiB0aGlzLm9wZW5Gb3J1bSB9KSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyW1wiZGVmYXVsdFwiXS5jcmVhdGVFbGVtZW50KF9tYXRlcmlhbFVpLkZsYXRCdXR0b24sIHsgcHJpbWFyeTogdHJ1ZSwgaWNvbjogX3JlYWN0MltcImRlZmF1bHRcIl0uY3JlYXRlRWxlbWVudChfbWF0ZXJpYWxVaS5Gb250SWNvbiwgeyBjbGFzc05hbWU6IFwibWRpIG1kaS1naXRodWItYm94XCIgfSksIGxhYmVsOiBcIklzc3Vlc1wiLCBvblRvdWNoVGFwOiB0aGlzLm9wZW5HaXRodWIgfSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBfcmVhY3QyW1wiZGVmYXVsdFwiXS5jcmVhdGVFbGVtZW50KF9tYXRlcmlhbFVpLkRpdmlkZXIsIG51bGwpLFxuICAgICAgICAgICAgX3JlYWN0MltcImRlZmF1bHRcIl0uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICBfbWF0ZXJpYWxVaS5DYXJkVGV4dCxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIGNyZWRpdFxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gX3JlYWN0MltcImRlZmF1bHRcIl0uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgIFwiZGl2XCIsXG4gICAgICAgICAgICB7IHN0eWxlOiB7IGhlaWdodDogJzEwMCUnLCBiYWNrZ3JvdW5kQ29sb3I6ICcjQ0ZEOERDJyB9IH0sXG4gICAgICAgICAgICBjcmVkaXRcbiAgICAgICAgKTtcbiAgICB9XG5cbn0pO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFNwbGFzaERpYWxvZztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xudmFyIGdsb2JhbCA9IHdpbmRvdztcbnZhciBweWRpbyA9IGdsb2JhbC5weWRpbztcbnZhciBNZXNzYWdlSGFzaCA9IHB5ZGlvLk1lc3NhZ2VIYXNoO1xuZXhwb3J0cy5nbG9iYWwgPSBnbG9iYWw7XG5leHBvcnRzLnB5ZGlvID0gcHlkaW87XG5leHBvcnRzLk1lc3NhZ2VIYXNoID0gTWVzc2FnZUhhc2g7XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2RpYWxvZ1NwbGFzaERpYWxvZyA9IHJlcXVpcmUoJy4vZGlhbG9nL1NwbGFzaERpYWxvZycpO1xuXG52YXIgX2RpYWxvZ1NwbGFzaERpYWxvZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kaWFsb2dTcGxhc2hEaWFsb2cpO1xuXG52YXIgX2RpYWxvZ1Bhc3N3b3JkRGlhbG9nID0gcmVxdWlyZSgnLi9kaWFsb2cvUGFzc3dvcmREaWFsb2cnKTtcblxudmFyIF9kaWFsb2dQYXNzd29yZERpYWxvZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kaWFsb2dQYXNzd29yZERpYWxvZyk7XG5cbnZhciBfY2FsbGJhY2tzQm9va21hcmtCdXR0b24gPSByZXF1aXJlKCcuL2NhbGxiYWNrcy9Cb29rbWFya0J1dHRvbicpO1xuXG52YXIgX2NhbGxiYWNrc0Jvb2ttYXJrQnV0dG9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NhbGxiYWNrc0Jvb2ttYXJrQnV0dG9uKTtcblxudmFyIENhbGxiYWNrcyA9IHtcbiAgICBzd2l0Y2hMYW5ndWFnZTogcmVxdWlyZSgnLi9jYWxsYmFja3Mvc3dpdGNoTGFuZ3VhZ2UnKSxcbiAgICBjaGFuZ2VQYXNzOiByZXF1aXJlKCcuL2NhbGxiYWNrcy9jaGFuZ2VQYXNzJyksXG4gICAgdG9nZ2xlQm9va21hcms6IHJlcXVpcmUoJy4vY2FsbGJhY2tzL3RvZ2dsZUJvb2ttYXJrJyksXG4gICAgYWN0aXZhdGVEZXNrdG9wTm90aWZpY2F0aW9uczogcmVxdWlyZSgnLi9jYWxsYmFja3MvYWN0aXZhdGVEZXNrdG9wTm90aWZpY2F0aW9ucycpXG59O1xuXG52YXIgTmF2aWdhdGlvbiA9IHtcbiAgICBzcGxhc2g6IHJlcXVpcmUoJy4vbmF2aWdhdGlvbi9zcGxhc2gnKSxcbiAgICB1cDogcmVxdWlyZSgnLi9uYXZpZ2F0aW9uL3VwJyksXG4gICAgcmVmcmVzaDogcmVxdWlyZSgnLi9uYXZpZ2F0aW9uL3JlZnJlc2gnKSxcbiAgICBleHRlcm5hbFNlbGVjdGlvbjogcmVxdWlyZSgnLi9uYXZpZ2F0aW9uL2V4dGVybmFsU2VsZWN0aW9uJyksXG4gICAgb3BlbkdvUHJvOiByZXF1aXJlKCcuL25hdmlnYXRpb24vb3BlbkdvUHJvJyksXG4gICAgc3dpdGNoVG9TZXR0aW5nczogcmVxdWlyZSgnLi9uYXZpZ2F0aW9uL3N3aXRjaFRvU2V0dGluZ3MnKSxcbiAgICBzd2l0Y2hUb0hvbWVwYWdlOiByZXF1aXJlKCcuL25hdmlnYXRpb24vc3dpdGNoVG9Ib21lcGFnZScpXG59O1xuXG5leHBvcnRzLkNhbGxiYWNrcyA9IENhbGxiYWNrcztcbmV4cG9ydHMuTmF2aWdhdGlvbiA9IE5hdmlnYXRpb247XG5leHBvcnRzLlNwbGFzaERpYWxvZyA9IF9kaWFsb2dTcGxhc2hEaWFsb2cyWydkZWZhdWx0J107XG5leHBvcnRzLlBhc3N3b3JkRGlhbG9nID0gX2RpYWxvZ1Bhc3N3b3JkRGlhbG9nMlsnZGVmYXVsdCddO1xuZXhwb3J0cy5Cb29rbWFya0J1dHRvbiA9IF9jYWxsYmFja3NCb29rbWFya0J1dHRvbjJbJ2RlZmF1bHQnXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE3IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2dsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciB1c2VyU2VsZWN0aW9uID0gX2dsb2JhbHMucHlkaW8uZ2V0VXNlclNlbGVjdGlvbigpO1xuICAgIGlmICh1c2VyU2VsZWN0aW9uLmlzVW5pcXVlKCkgJiYgIXVzZXJTZWxlY3Rpb24uaGFzRGlyKCkpIHtcbiAgICAgICAgdmFyIGZpbGVOYW1lID0gdXNlclNlbGVjdGlvbi5nZXRVbmlxdWVGaWxlTmFtZSgpO1xuICAgICAgICB2YXIgc2VsZWN0b3JEYXRhID0gX2dsb2JhbHMucHlkaW8uZ2V0Q29udHJvbGxlcigpLnNlbGVjdG9yRGF0YTtcbiAgICAgICAgaWYgKHNlbGVjdG9yRGF0YS5nZXQoJ3R5cGUnKSA9PSBcImNrZWRpdG9yXCIpIHtcbiAgICAgICAgICAgIHZhciBja0RhdGEgPSBzZWxlY3RvckRhdGEuZ2V0KCdkYXRhJyk7XG4gICAgICAgICAgICBpZiAoY2tEYXRhWydDS0VkaXRvckZ1bmNOdW0nXSkge1xuICAgICAgICAgICAgICAgIHZhciBpbWFnZVBhdGggPSBmaWxlTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoY2tEYXRhWydyZWxhdGl2ZV9wYXRoJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VQYXRoID0gY2tEYXRhWydyZWxhdGl2ZV9wYXRoJ10gKyBmaWxlTmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2dsb2JhbHMuZ2xvYmFsLm9wZW5lci5DS0VESVRPUi50b29scy5jYWxsRnVuY3Rpb24oY2tEYXRhWydDS0VkaXRvckZ1bmNOdW0nXSwgaW1hZ2VQYXRoKTtcbiAgICAgICAgICAgICAgICBfZ2xvYmFscy5nbG9iYWwuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKCkge1xuICBfZ2xvYmFscy5nbG9iYWwub3BlbignaHR0cHM6Ly9weWRpby5jb20vZW4vZ28tcHJvP3JlZmVycmVyPXNldHRpbmdzJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE3IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2dsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uICgpIHtcblxuICBfZ2xvYmFscy5weWRpby5maXJlQ29udGV4dFJlZnJlc2goKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKCkge1xuXG4gIF9nbG9iYWxzLnB5ZGlvLlVJLm9wZW5Db21wb25lbnRJbk1vZGFsKCdQeWRpb0NvcmVBY3Rpb25zJywgJ1NwbGFzaERpYWxvZycpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9nbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoIV9nbG9iYWxzLnB5ZGlvLnJlcG9zaXRvcnlJZCB8fCBfZ2xvYmFscy5weWRpby5yZXBvc2l0b3J5SWQgIT09IFwiaG9tZXBhZ2VcIikge1xuICAgICAgICBfZ2xvYmFscy5weWRpby50cmlnZ2VyUmVwb3NpdG9yeUNoYW5nZSgnaG9tZXBhZ2UnKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE3IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2dsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICghX2dsb2JhbHMucHlkaW8ucmVwb3NpdG9yeUlkIHx8IF9nbG9iYWxzLnB5ZGlvLnJlcG9zaXRvcnlJZCAhPT0gXCJzZXR0aW5nc1wiKSB7XG4gICAgICAgIF9nbG9iYWxzLnB5ZGlvLnRyaWdnZXJSZXBvc2l0b3J5Q2hhbmdlKCdzZXR0aW5ncycpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKCkge1xuXG4gIF9nbG9iYWxzLnB5ZGlvLmZpcmVDb250ZXh0VXAoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIl19
