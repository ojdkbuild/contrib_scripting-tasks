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
    "lib/hash/digestFile",
    "lib/hash/writeHashFile",
    "lib/sign/signFile",
    "lib/sign/verifyFile"
], function(module, Logger, digestFile, writeHashFile, signFile, verifyFile) {
    "use strict";
    var logger = new Logger(module.id);

    var attempts = 3;

    return function(file, name, mock) {
        logger.info("task started");
 
        var sha256 = digestFile(file, "SHA-256");
        logger.info("Signing file, path: [" + file + "], sha256: [" + sha256 + "]");

        var success = false;
        var codes = [];
        for (var i = 0; i < attempts; i++) {
            var code = signFile(file, name, mock);
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

        var sha256Signed = digestFile(file, "SHA-256");
 
        writeHashFile(file, sha256Signed, ".sha256");
        logger.info("Hash file written, path: [" + file + ".sha256" + "]");

        logger.info("task success");
    };
});