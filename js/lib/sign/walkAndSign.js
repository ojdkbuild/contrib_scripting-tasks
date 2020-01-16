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
    // module
    "module",
    // common
    "../common/endsWith",
    "../common/isNil",
    "../common/startsWith",
    "../common/Logger",
    // io
    "../io/deleteDirectory",
    "../io/listDirectory",
    //jmod
    "../jmod/jmodBundle",
    "../jmod/jmodDescribe",
    "../jmod/jmodExtract",
    "../jmod/jmodHash",
    "../jmod/jmodList",
    // local
    "./signFile",
    "./verifyFile",
    "test/assert"
], function(
        module, // module
        endsWith, isNil, startsWith, Logger, // common
        deleteDirectory, listDirectory, //io
        jmodBundle, jmodDescribe, jmodExtract, jmodHash, jmodList, // jmod
        signFile, verifyFile, assert // local
) {
    "use strict";
    var logger = new Logger(module.id);

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    var attempts = 3;

    var prefixes = [
        "msvc",
        "api-ms-win",
        "vcruntime"
    ];

    var postfixes = [
        ".exe",
        ".dll"
    ];

    function shouldSign(file) {
        var post = false;
        for (var i = 0; i < postfixes.length; i++) {
            if (endsWith(file, postfixes[i])) {
                post = true;
                break;
            }
        }
        if (!post) {
            return false;
        }
        var pre = true;
        for (var i = 0; i < prefixes.length; i++) {
            if (startsWith(file, prefixes[i])) {
                pre = false;
                break;
            }
        }
        if (!pre) {
            return false;
        }
        return true;
    }

    function walkAndSign(dirPath, mock) {
        var list = listDirectory(String(dirPath.toAbsolutePath()));
        var jbasePath = null;
        list.forEach(function(en) {
            var pa = Paths.get(dirPath, en);
            if (Files.isDirectory(pa)) {
                walkAndSign(pa, mock);
            } else if (endsWith(en, ".jmod")) {
                logger.info("Re-packing JMOD, path: [" + pa + "]");
                var jmod = String(pa);
                var descOrig = jmodDescribe(jmod);
                var contentsOrig = jmodList(jmod);
                var sizeOrig = Files.size(pa);
                var dir = jmodExtract(jmod);
                Files.delete(pa);
                walkAndSign(Paths.get(dir), mock);
                jmodBundle(dir);
                deleteDirectory(dir);
                assert.equal(jmodDescribe(jmod), descOrig);
                assert.equal(jmodList(jmod), contentsOrig);
                var sizeDiff = Files.size(pa) - sizeOrig;
                //assert(sizeDiff >= -8 && sizeDiff <= 8);
                if ("java.base.jmod" === en) {
                    jbasePath = String(pa.toAbsolutePath());
                }
            } else if(shouldSign(en)) {
                logger.info("Signing file, path: [" + pa + "]");
                var success = false;
                var codes = [];
                for (var i = 0; i < attempts; i++) {
                    var file = String(pa.toAbsolutePath());
                    var code = signFile(file, String(pa.getFileName()), mock);
                    if (0 === code) {
                        success = true;
                        break;
                    } else {
                        codes.push(code);
                    }
                }
                if (!success) {
                    throw new Error("Error signing file, codes: [" + JSON.stringify(codes) + "]");
                }
                var vcode = verifyFile(file, mock);
                if (0 !== vcode) {
                    throw new Error("Error verifying file, code: [" + vcode + "]");
                }
            } else {
                //logger.info("Skipping file, path: [" + pa + "]");
            } 
        });
        if (!isNil(jbasePath)) {
            // jdk11 list
            jmodHash(jbasePath, [
                "java.compiler",
                "jdk.aot",
                "jdk.internal.vm.compiler",
                "jdk.internal.vm.compiler.management"
            ]);
        }
    }

    return function(dir, mock) {
        logger.info("Signing directory, path: [" + dir + "]");
        var dirPath = Paths.get(dir);
        if (!(Files.exists(dirPath) && Files.isDirectory(dirPath))) {
            throw new Error("Invalid directory specified, path: [" + dirPath.toAbsolutePath() + "]");
        }
        walkAndSign(dirPath, mock);
    };

});
