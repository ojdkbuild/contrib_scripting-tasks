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
    "common/Logger",
    "common/readFile",
    "common/writeFile",
    "common/writeHashFile",
    "test/scratch"
], function(module, assert, Logger, readFile, writeFile, writeHashFile, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    var file = scratch + "writeHashFileTest.txt";
    writeFile(file, "foo");
    
    writeHashFile(file, "bar", ".boo");

    var hashFile = file + ".boo";
    var hashPath = Paths.get(hashFile);
    assert(Files.exists(hashPath));
    assert(Files.isRegularFile(hashPath));

    var contents = readFile(hashFile);
    assert.equal(contents, "bar  " + Paths.get(file).getFileName());
});
