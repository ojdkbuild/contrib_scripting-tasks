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
    "lib/io/writeFile",
    "lib/sign/walkAndSign",
    "test/assert",
    "test/scratch"
], function(module, appdir, Logger, writeFile, walkAndSign, assert, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");
    Logger.disableModule("lib/sign/walkAndSign");

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    var dir = Paths.get(scratch + "walkAndSignTest");
    Files.createDirectory(dir);
    var jmodSrc = Paths.get(appdir + "js/test/data/jdk.net.jmod");
    var jmodDest = Paths.get(dir, "jdk.net.jmod");
    Files.copy(jmodSrc, jmodDest);
    writeFile(scratch + "walkAndSignTest/foo.txt", "foo");
    var subdir = Paths.get(dir, "bar");
    Files.createDirectory(subdir);
    writeFile(scratch + "walkAndSignTest/bar/baz.exe", "boo1");
    writeFile(scratch + "walkAndSignTest/bar/boo.dll", "boo2");
    writeFile(scratch + "walkAndSignTest/bar/bee.txt", "boo3");
    walkAndSign(String(dir), true);

});
