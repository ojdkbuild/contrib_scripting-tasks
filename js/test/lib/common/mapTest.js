/*
 * Copyright 2019, akashche at redhat.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define([
    "module",
    "lib/common/isArray",
    "lib/common/map",
    "lib/common/Logger",
    "test/assert"
], function(module, isArray, map, Logger, assert) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var list = map(["foo", "bar", "baz"], function(el) {
        return el + "42";
    });

    assert(isArray(list));
    assert.equal(list.length, 3);
    assert.equal(list, ["foo42", "bar42", "baz42"]);

    var empty = map([], function() {});
    assert(isArray(empty));
    assert.equal(empty.length, 0);
});
