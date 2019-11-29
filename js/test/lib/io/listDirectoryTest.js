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
    "lib/common/appdir",
    "lib/common/isArray",
    "lib/common/includes",
    "lib/io/listDirectory",
    "lib/common/Logger"
], function(module, assert, appdir, isArray, includes, listDirectory, Logger) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var list = listDirectory(appdir);

    assert(isArray(list));
    assert(list.length > 0);
    assert.equal(list[0], ".git");
    assert(includes(list, ".gitignore"));

});
