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
    "../common/isArray",
    "../common/startsWith",
    "../io/listDirectory",
    "./jmodTool"
], function(isArray, startsWith, listDirectory, jmodTool) {
    "use strict";

    var PrintWriter = Packages.java.io.PrintWriter;
    var StringWriter = Packages.java.io.StringWriter;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    return function(dir, addArgs) {
        var dirPath = Paths.get(dir);
        if (!(Files.exists(dirPath) && Files.isDirectory(dirPath))) {
            throw new Error("Invalid JMOD directory specified: [" + dirPath.toAbsolutePath() + "]");
        }
        var destPath = Paths.get(dir + ".jmod");
        if (Files.exists(destPath)) {
            throw new Error("Destination file already exists, path: [" + destPath.toAbsolutePath() + "]");
        }

        var children = listDirectory(dir);
        var args = ["create"];
        children.forEach(function(ch) {
            if ("bin" === ch) {
                args.push("--cmds");
            } else if ("classes" === ch) {
                args.push("--class-path");
            } else if ("conf" === ch) {
                args.push("--config");
            } else if ("include" === ch) {
                args.push("--header-files");
            } else if ("legal" === ch) {
                args.push("--legal-notices");
            } else if ("lib" === ch) {
                args.push("--libs");
            } else {
                throw new Error("Invalid JMOD entry, path: [" + ch + "]");
            }
            args.push(dir + "/" + ch);
        });

        if (startsWith(destPath.getFileName().toString(), "jdk.incubator.")) {
            args.push("--do-not-resolve-by-default");
            args.push("--warn-if-resolved=incubating");
        }

        if (isArray(addArgs)) {
            addArgs.forEach(function(ar) {
                args.push(ar);
            });
        }

        args.push(dir + ".jmod");

        var sw = new StringWriter();
        var pw = new PrintWriter(sw);
        //logger.info("JSON.stringify(args)");
        var code = jmodTool.run(pw, pw, args);
        if (0 !== code) {
            throw new Error("JMOD run error, output: [" + sw + "], args: [" + JSON.stringify(args, null, 4) + "]");
        }

        return dir;
    };

});
