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
    "lib/common/appdir",
], function(appdir) {
    "use strict";

    var System = Packages.java.lang.System;
    var ProcessBuilder = Packages.java.lang.ProcessBuilder;
    var File = Packages.java.io.File;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    return function(jcstressJar, resultsFile, mock) {
        var jcPath = Paths.get(jcstressJar);
        if (!(Files.exists(jcPath) && Files.isRegularFile(jcPath)) && (true !== mock)) {
            throw new Error("Invalid 'jcstress.jar' file specified, path: [" + jcPath.toAbsolutePath() + "]");
        }
        var javaExe = System.getProperty("java.home") + "/bin/java.exe";

        if (true !== mock) {
            return new ProcessBuilder(
                    javaExe,
                    "-jar",
                    jcstressJar,
                    "-m",
                    "quick"
                    ).redirectOutput(new File(resultsFile)).start().waitFor();
        } else {
            var mockSrc = Paths.get(appdir + "js/test/data/jcstress_results.txt");
            var mockDest = Paths.get(resultsFile);
            Files.copy(mockSrc, mockDest);
            return 0;
        }
    };

});
