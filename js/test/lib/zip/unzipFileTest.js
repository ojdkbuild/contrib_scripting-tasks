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
    "lib/io/deleteDirectory",
    "lib/io/readFile",
    "lib/io/writeFile",
    "lib/zip/unzipFile",
    "lib/zip/zipDirectory",
    "test/assert",
    "test/scratch"
], function(module, Logger, deleteDirectory, readFile, writeFile, unzipFile, zipDirectory, assert, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    var dir = Paths.get(scratch + "unzipFileTest");
    var zipDir = Paths.get(dir, "zipdir");
    Files.createDirectories(zipDir);
    var foo = Paths.get(zipDir, "foo.txt");
    var bar = Paths.get(zipDir, "bar.txt");
    writeFile(String(foo), "foo");
    writeFile(String(bar), "bar");
    var zip = zipDirectory(zipDir);
    deleteDirectory(zipDir);

    // normal
    unzipFile(zip);
    assert(Files.exists(zipDir) && Files.isDirectory(zipDir));
    assert.equal(readFile(String(foo)), "foo");
    assert.equal(readFile(String(bar)), "bar");

    // nodir
    deleteDirectory(zipDir);
    unzipFile(zip, "nodirs");
    assert(!Files.exists(zipDir));
    assert.equal(readFile(Paths.get(dir, "foo.txt")), "foo");
    assert.equal(readFile(Paths.get(dir, "bar.txt")), "bar");

});
