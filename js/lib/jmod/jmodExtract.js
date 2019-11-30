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
    "../common/endsWith",
    "./jmodTool"
], function(endsWith, jmodTool) {
    "use strict";

    var PrintWriter = Packages.java.io.PrintWriter;
    var StringWriter = Packages.java.io.StringWriter;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    return function(file) {
        var path = Paths.get(file);
        if (!(Files.exists(path) && Files.isRegularFile(path)) &&
                endsWith(file, ".jmod")) {
            throw new Error("Invalid JMOD file specified: [" + path.toAbsolutePath() + "]");
        }
        var dir = file.replace(/\.jmod$/, "");
        var dirPath = Paths.get(dir);
        if (Files.exists(dirPath)) {
            throw new Error("Destination directory already exists, path: [" + dirPath.toAbsolutePath() + "]");
        }

        var args = ["extract", "--dir", dir, file];
        var sw = new StringWriter();
        var pw = new PrintWriter(sw);
        // print("JSON.stringify(args)");
        var code = jmodTool.run(pw, pw, args);
        if (0 !== code) {
            throw new Error("JMOD run error, output: [" + sw + "]");
        }

        return dir;
    };

});
