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
    "../common/isString"
], function(isString) {
    "use strict";

    var ProcessBuilder = Packages.java.lang.ProcessBuilder;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    var signtoolPath = "C:/Program Files (x86)/Windows Kits/10/bin/x64/signtool.exe";
    var timestampUrl = "http://sha256timestamp.ws.symantec.com/sha256/timestamp";
    var vendor = "Red Hat";
    var algorithm = "SHA256";

    return function(file, name, mock) {
        var path = Paths.get(file);
        if (!(Files.exists(path) && Files.isRegularFile(path))) {
            throw new Error("Invalid file specified, path: [" + path.toAbsolutePath() + "]");
        }
        if (!isString(name) || 0 === name.length) {
            throw new Error("Invalid name specified, value: [" + name + "]");
        }

        if (true !== mock) {
            return new ProcessBuilder(
                    signtoolPath,
                    "sign",
                    "/v",
                    "/n", vendor,
                    "/fd", algorithm,
                    "/tr", timestampUrl,
                    "/d", name,
                    path.toAbsolutePath().toString()
                    ).inheritIO().start().waitFor();
        } else {
            return 0;
        }
    };

});
