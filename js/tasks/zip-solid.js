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
    "lib/zip/zipDirectory",
    "lib/zip/zipFile"
], function(module, Logger, zipDirectory, zipFile) {
    "use strict";
    var logger = new Logger(module.id);

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    return function(dir, level) {
        logger.info("task started");
        logger.info("Zipping directory into solid archive," +
                " path: [" + dir + "], level: [" + 0 + "]");

        var solidInitial = zipDirectory(dir, 0);
        var solidPath = Paths.get(dir + ".solid.zip");
        Files.move(Paths.get(solidInitial), solidPath);

        logger.info("Compressing solid archive," +
                " path: [" + solidPath + "], level: [" + level + "]");
        var compInitial = zipFile(String(solidPath), level);
        Files.delete(solidPath);
        Files.move(Paths.get(compInitial), Paths.get(dir + ".zip"));

        logger.info("task success");
    };
});
