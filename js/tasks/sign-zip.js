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
    "lib/common/endsWith",
    "lib/common/Logger",
    "lib/hash/digestFile",
    "lib/hash/writeHashFile",
    "lib/sign/walkAndSign",
    "lib/zip/unzipFile",
    "lib/zip/zipDirectory"
], function(module, endsWith, Logger, digestFile, writeHashFile, walkAndSign, unzipFile, zipDirectory) {
    "use strict";
    var logger = new Logger(module.id);

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    return function(zipFile) {
        logger.info("task started");

        if (!endsWith(zipFile, ".zip")) {
            throw new Error("Invalid ZIP file name specified, path: [" + zipFile + "]");
        }
        var md5 = digestFile(zipFile, "MD5");
        var sha256 = digestFile(zipFile, "SHA-256");

        logger.info("Unzippping file, path: [" + zipFile + "], md5: [" + md5 + "]," +
                " sha256: [" + sha256 + "]");
        unzipFile(zipFile);

        var dir = zipFile.replace(/\.zip$/, "");
        logger.info("Signing bundle files, path: [" + dir + "]");
        walkAndSign(dir);

        logger.info("Removing original ZIP file");
        var zipFilePath = Paths.get(zipFile);
        Files.delete(zipFilePath);

        logger.info("Bundling signed files into ZIP");
        zipDirectory(dir);

        logger.info("Writing hash sum");
        var sha256signed = digestFile(zipFile, "SHA-256");
        writeHashFile(zipFile, sha256signed, ".sha256");

        logger.info("ZIP with signed files bundled, sha256: [" + sha256signed + "]");

        logger.info("task success");
    };
});