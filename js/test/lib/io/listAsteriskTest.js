/*
 * Copyright 2021, akashche at redhat.com
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
    "lib/common/endsWith",
    "lib/common/isArray",
    "lib/common/includes",
    "lib/common/Logger",
    "lib/io/listAsterisk",
    "lib/io/writeFile",
    "test/assert",
    "test/scratch"
], function(module, endsWith, isArray, includes, Logger, listAsterisk, writeFile, assert, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    var dir = scratch + "listAsteriskTest/";
    Files.createDirectory(Paths.get(dir));
    writeFile(dir + "foo", "foo");
    writeFile(dir + "bar", "bar");
    Files.createDirectory(Paths.get(dir + "barbar"));

    // asterisk
    var list = listAsterisk(dir + "*bar");
    assert(isArray(list));
    assert.equal(list.length, 2);
    assert(endsWith(list[0], "barbar"));
    assert(endsWith(list[1], "bar"));

    // single
    var single = listAsterisk(dir + "foo");
    assert(isArray(single));
    assert.equal(single.length, 1);
    assert.equal(single, [
        dir + "foo"
    ]);

});
