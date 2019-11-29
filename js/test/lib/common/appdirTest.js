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
    "lib/common/appdir",
    "lib/common/isString",
    "lib/common/Logger",
    "test/assert"
], function(module, appdir, isString, Logger, assert) {
    "use strict";
    var logger = new Logger(module.id);

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    logger.info("run");

    assert(isString(appdir));

    var path = Paths.get(appdir);

    assert(Files.exists(path));
    assert(Files.isDirectory(path));

    var rhino = Paths.get(appdir + "bin/rhino");

    assert(Files.exists(rhino));
    assert(Files.isRegularFile(rhino));
});
