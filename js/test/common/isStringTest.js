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
    "test/assert",
    "common/isString",
    "common/Logger"
], function(module, assert, isString, Logger) {
    "use strict";
    var logger = new Logger(module.id);

    var JString = Packages.java.lang.String;

    logger.info("run");

    assert(isString("foo"));
    assert(isString(""));
    assert(!isString(new String("foo")));
    assert(!isString(new JString()));
    assert(!isString(['f', 'o', 'o']));
    assert(!isString({}));

});