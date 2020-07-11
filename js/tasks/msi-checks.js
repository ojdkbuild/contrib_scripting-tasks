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
    "lib/common/endsWith",
    "lib/common/filter",
    "lib/common/Logger",
    "lib/common/startsWith",
    "lib/io/deleteDirectory",
    "lib/io/listDirectory"
], function(module, appdir, endsWith, filter, Logger, startsWith, deleteDirectory, listDirectory) {
    "use strict";
    var logger = new Logger(module.id);

    var System = Packages.java.lang.System;
    var ProcessBuilder = Packages.java.lang.ProcessBuilder;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    function suiteName(msi) {
        if (startsWith(msi, "java-1.8.0-openjdk")) {
            return "jdk8";
        } else if (startsWith(msi, "java-11-openjdk-jre")) {
            return "jdk11jre";
        } else if (startsWith(msi, "java-11-openjdk")) {
            return "jdk11";
        } else if (-1 != msi.indexOf("openjdk-jre")) {
            return "jdklatestjre";
        } else {
            return "jdklatest";
        }
    }

    return function(dir) {
        logger.info("task started");

        var dirPath = Paths.get(dir);
        if (!(Files.exists(dirPath) && Files.isDirectory(dirPath))) {
            throw new Error("Specified MSI directory does not exist, path: [" + dirPath.toAbsolutePath() + "]");
        }
        logger.info("Looking for MSIs in directory, path: [" + dir + "] ...");

        var files = listDirectory(dir);
        var msiList = filter(files, function(fi) {
            return endsWith(fi, ".msi");
        });
        if (0 === msiList.length) {
            throw new Error("No MSI files found in specified directory, path: [" + dirPath.toAbsolutePath() + "]");
        }

        if (Files.exists(Paths.get("JTwork"))) {
            deleteDirectory("JTwork");
        }

        var javaExec = System.getProperty("java.home") + "/bin/java.exe";
        var jtregJar = appdir + "../../tools/jtreg42_653/lib/jtreg.jar";
        var checkDir = appdir + "../installer-checks/";
        msiList.forEach(function(msi) {
            logger.info("Running checks for MSI, name: [" + msi + "]");
            var msiPath = Paths.get(dirPath, msi).toRealPath();
            var suite = suiteName(msi);
            var code = new ProcessBuilder(
                    javaExec,
                    "-jar",
                    jtregJar,
                    "-v1",
                    "-nr",
                    "-e:TESTJDK_MSI_PATH=" + msiPath.toAbsolutePath(),
                    checkDir + suite
                    ).inheritIO().start().waitFor();
            if (0 !== code) {
                throw new Error("jtreg run failure, code: [" + code + "]");
            }
        });

        logger.info("task success");
    };
});
