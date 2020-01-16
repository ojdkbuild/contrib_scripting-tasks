/*
 * Copyright 2020, akashche at redhat.com
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
    "lib/jmod/jmodDescribe",
    "lib/jmod/jmodHash",
    "lib/jmod/jmodList",
    "test/assert",
    "test/scratch"
], function(module, appdir, Logger, jmodDescribe, jmodHash, jmodList, assert, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");
    Logger.disableModule("lib/jmod/jmodHash");

    var System = Packages.java.lang.System;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    var dir = scratch + "jmodHashTest/";
    Files.createDirectory(Paths.get(dir));
    var jmodPathSrc = Paths.get(appdir + "js/test/data/jdk.net.jmod");
    var jmodPath = Paths.get(dir + "jdk.net.jmod");
    var jmodDepPath = Paths.get(dir + "jdk.testmod.jmod");
    var jmodsDir = System.getProperty("java.home") + "/jmods/";

    Files.copy(jmodPathSrc, jmodPath);
    Files.copy(jmodPathSrc, jmodDepPath);
    Files.copy(Paths.get(jmodsDir + "java.base.jmod"), Paths.get(dir + "java.base.jmod"));

    var orig = String(jmodPathSrc);
    var bundled = String(jmodPath);

    jmodHash(bundled, ["mod.foo", "mod.bar"]);

    assert.equal(jmodDescribe(orig), jmodDescribe(bundled));
    assert.equal(jmodList(orig), jmodList(bundled));

    // it is non-trivial to actually add a hash here
});
