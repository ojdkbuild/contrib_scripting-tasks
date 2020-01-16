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
    "lib/common/Logger",
    "lib/io/listDirectory",
    "lib/jmod/jmodExtract",
    "test/assert",
    "test/scratch"
], function(module, appdir, Logger, listDirectory, jmodExtract, assert, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    var jmodPathSrc = Paths.get(appdir + "js/test/data/jdk.net.jmod");
    Files.createDirectory(Paths.get(scratch + "jmodDescribeTest"));
    var jmodPath = Paths.get(scratch + "jmodDescribeTest/jdk.net.jmod");

    Files.copy(jmodPathSrc, jmodPath);

    var dir = jmodExtract(String(jmodPath));

    assert.equal(dir, String(Paths.get(scratch + "jmodDescribeTest/jdk.net")));
    var dirPath = Paths.get(dir);
    assert(Files.exists(dirPath));
    assert(Files.isDirectory(dirPath));

    var children = listDirectory(dir);
    assert.equal(children, ["classes", "legal"]);
});
