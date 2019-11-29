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
    "lib/common/Logger",
    "lib/io/writeFile",
    "lib/zip/zipDirectory",
    "test/scratch"
], function(module, assert, Logger, writeFile, zipDirectory, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    var dir = Paths.get(scratch + "zipDirectoryTest");
    Files.createDirectories(dir);
    var foo = Paths.get(dir, "foo.txt");
    var bar = Paths.get(dir, "bar.txt");
    writeFile(String(foo), "foo");
    writeFile(String(bar), "bar");

    var zip = zipDirectory(dir);
    assert(Files.exists(Paths.get(zip)));

});

