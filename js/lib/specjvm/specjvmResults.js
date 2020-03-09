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
    "lib/io/withFileLines"
], function(withFileLines) {
    "use strict";

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    return function(resultsFile) {
        var resPath = Paths.get(resultsFile);
        if (!(Files.exists(resPath) && Files.isRegularFile(resPath))) {
            throw new Error("Invalid results file specified, path: [" + resPath.toAbsolutePath() + "]");
        }

        var lines = [];
        var state = "start";
        withFileLines(resultsFile, function(li) {
            if ("start" === state) {
                if (/^# Warmup: 10 iterations, 3 s each$/.test(li)) {
                    lines.push("[running]");
                    state = "running";
                } else {
                    lines.push(li);
                }
            } else if ("running" === state) {
                if (/^# Run complete\. Total time: .+$/.test(li)) {
                    lines.push(li);
                    state = "results";
                }
            } else if ("results" === state) {
                lines.push(li);
            } else throw new Error("Invalid state: [" + state + "]");
        });

        return lines;
    };

});
