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
    "lib/common/Logger",
    "lib/io/writeFile",
    "test/assert",
    "test/scratch"
], function(module, Logger, writeFile, assert, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var JString = Packages.java.lang.String;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    var file = scratch + "writeFileTest.txt";
    writeFile(file, "foo");

    var path = Paths.get(file);
    var read = String(new JString(Files.readAllBytes(path), "UTF-8"));

    assert.equal(read, "foo");
});
