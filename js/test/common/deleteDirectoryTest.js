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
    "common/deleteDirectory",
    "common/Logger",
    "common/writeFile",
    "test/scratch"
], function(module, assert, deleteDirectory, Logger, writeFile, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    logger.info("run");

    var dir = Paths.get(scratch + "deleteDirectoryTest");;
    var file = Paths.get(dir, "tmp.txt");
    Files.createDirectory(dir);
    writeFile(file, "foo");

    deleteDirectory(dir);

    assert(!Files.exists(dir));
});
