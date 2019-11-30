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
    "lib/io/deleteDirectory",
    "lib/io/writeFile",
    "lib/zip/zipDirectory",
    "tasks/sign-zip",
    "test/assert",
    "test/scratch"
], function(module, appdir, Logger, deleteDirectory, writeFile, zipDirectory, task, assert, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    logger.info("run");
    Logger.disableModule("lib/sign/walkAndSign");
    Logger.disableModule("tasks/sign-zip");

    var dir = Paths.get(scratch + "sign-zip_Test");
    Files.createDirectory(dir);
    var subdir = Paths.get(dir, "sub");
    Files.createDirectory(subdir);
    writeFile(String(subdir) + "/foo.dll", "foo");
    writeFile(String(dir) + "/bar.txt", "bar");
    var jmodSrc = Paths.get(appdir + "js/test/data/jdk.jsobject.jmod");
    var jmodDest = Paths.get(subdir, "jdk.jsobject.jmod");
    Files.copy(jmodSrc, jmodDest);

    var zip = zipDirectory(dir);
    deleteDirectory(dir);

    task(zip, true);

    var hashPath = Paths.get(zip + ".sha256");
    assert(Files.exists(hashPath));
});
