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
    "lib/io/readFile",
    "tasks/sha256-file",
    "test/assert",
    "test/scratch"
], function(module, Logger, readFile, task, assert, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    var JString = Packages.java.lang.String;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    logger.info("run");
    Logger.disableModule("tasks/sha256-file");

    var path = Paths.get(scratch + "sha256Test.txt");;
    Files.write(path, new JString("foo").getBytes("UTF-8"));

    task(String(path.toAbsolutePath()));

    var destPath = Paths.get(path.toAbsolutePath() + ".sha256");
    var res = readFile(destPath);


    assert.equal(res, "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae  " + path.getFileName());
});
