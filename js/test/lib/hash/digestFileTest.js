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
    "lib/common/Logger",
    "lib/hash/digestFile"
], function(module, assert, appdir, Logger, digestFile) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var sha256 = digestFile(appdir + ".gitignore", "SHA-256");

    assert.equal(sha256, "08410a0485e3e0eb8e7e5c4f8b581faea962d292d2ee5b63cb1b2dd8d0a330d4");
});
